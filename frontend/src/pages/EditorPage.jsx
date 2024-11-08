import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useBlocker, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { SettingsContext } from "../../context/SettingsContext";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import Canvas from "../Components/Canvas";
import NameModal from "../Components/NameModal";
import Tabs from "../Components/Tabs";
import TextEditor from "../Components/TextEditor";
import CodeEditor from "../Components/CodeEditor";

function EditorPage() {
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const [isSolo, setIsSolo] = useState(true);
  const codeEditorRef = useRef(null);
  const [openCollaborationPopup, setOpenCollaborationPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  // const [username, setUsername] = useState("");
  const [codeBoardBotResults, setCodeBoardBotResults] = useState({
    imageAnalysisResult: [],
    contentGenerationResults: [],
  });
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const settingsContext = useContext(SettingsContext);
  const location = useLocation();

  const [username, setUsername] = useState();
  const { roomId } = useParams();

  const [codeEditorContent, setCodeEditorContent] = useState("");
  const [codeEditorOutput, setCodeEditorOutput] = useState([]);
  const [isCodeExecutionRunning, setIsCodeExecutionRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const [textContent, setTextContent] = useState("");
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pistonSupportedRuntimes, setPistonSupportedRuntimes] = useState([]);
  const [filesData, setFilesData] = useState([
    {
      fileName: "script.js",
      language: "javascript",
      content: 'console.log("Hello world")',
      runCodeOption: true,
    },
  ]);

  useEffect(() => {
    if (roomId) {
      setIsSolo(false);
    }

    if (
      !sessionStorage.getItem("currentUsername") &&
      (!location.state || !location.state.username)
    ) {
      setShowModal(true);
      return;
    }

    function handleErrors(e) {
      console.log("Socker Error", e);
      setShowLoader(true);
    }

    async function init() {
      console.log("Initializing socket connection...");
      const currentUsername = !location.state
        ? sessionStorage.getItem("currentUsername")
        : location.state.username;

      settingsContext.updateSettings("username", currentUsername);
      settingsContext.updateSettings("roomId", roomId);
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
        setShowLoader(false);
      });

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: currentUsername,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== currentUsername) {
            toast(`${username} joined the room.`, {
              icon: "📢",
            });
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CHANGES, {
            roomId,
            socketId,
          });
        }
      );

      // Listening for code change
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setCodeEditorContent(code);
        }
      });
      // Listening for Text changes
      socketRef.current.on(ACTIONS.TEXT_CHANGE, ({ text }) => {
        if (text !== null) {
          setTextContent(text);
        }
      });
      // Listening for code change
      socketRef.current.on(ACTIONS.SYNC_CHANGES, ({ roomData }) => {
        if (roomData) {
          console.log(roomData);
        }
        if (roomData && roomData.code !== null) {
          setCodeEditorContent(roomData.code);
        }

        if (roomData && roomData.text.length > 0) {
          setTextContent(roomData.text);
        }
        if (roomData && roomData.messages.length > 0) {
          setMessages(roomData.messages);
        }
      });

      // Handle cursor updates from other users
      socketRef.current.on(ACTIONS.CURSOR_UPDATE, (roomData) => {
        console.log("Room data is", roomData);
      });

      // Listening for message
      socketRef.current.on(
        ACTIONS.MESSAGE,
        ({ message, id, username, timestamp }) => {
          if (username !== currentUsername) {
            toast(`${username} sent a message`, {
              icon: "💬",
            });
          }

          setMessages((prev) => [
            ...prev,
            { message, username, id, timestamp },
          ]);
        }
      );

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast(`${username} left the room.`, {
          icon: "📢",
        });
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    }

    async function getAllRuntimes() {
      try {
        const response = await fetch("https://emkc.org/api/v2/piston/runtimes");
        const data = await response.json();
        console.log("Data is", data);
        setPistonSupportedRuntimes([...data]);
      } catch (e) {
        console.log("Error in getting all runtimes", e);
        toast.error(
          "Error in getting all runtimes. Please don't try to execute code now."
        );
      }
    }

    if (!isSolo) {
      init();
    }
    // getAllRuntimes();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, [username, isSolo]);

  function handleModalJoinClick(username) {
    if (username.length < 5 || username.length > 20) {
      return;
    }

    sessionStorage.setItem("currentUsername", username);
    setUsername(username);
    setShowModal(false);
  }

  const blocker = useCallback(() => {
    // Display a dialog box to the user.
    var message = "Are you sure you want to leave this page?";
    var result = window.confirm(message);

    // If the user clicks on the "Cancel" button, prevent the browser from navigating away from the page.
    return !result;
  }, []);

  useBlocker(blocker);

  function findMatches(searchTerm) {
    const matches = [];

    pistonSupportedRuntimes.forEach((item) => {
      if (
        item.language.toLowerCase() === searchTerm.toLowerCase() ||
        item.aliases.some(
          (alias) => alias.toLowerCase() === searchTerm.toLowerCase()
        )
      ) {
        matches.push(item);
      }
    });

    return matches;
  }
  // Helper function to compare version strings
  function compareVersions(versionA, versionB) {
    const versionArrayA = versionA.split(".").map(Number);
    const versionArrayB = versionB.split(".").map(Number);

    for (
      let i = 0;
      i < Math.max(versionArrayA.length, versionArrayB.length);
      i++
    ) {
      const numA = versionArrayA[i] || 0; // If undefined, treat as 0
      const numB = versionArrayB[i] || 0;

      if (numA > numB) return 1;
      if (numA < numB) return -1;
    }

    return 0; // Versions are equal
  }

  const runCode = async (language, code) => {
    if (isCodeExecutionRunning) return;

    const matches = findMatches(language);
    if (matches.length === 0) {
      toast.error("Cannot execute your code. Please select a valid language.");
      return;
    }

    const highestVersion = matches.sort((a, b) => {
      // Compare the version strings
      return compareVersions(b.version, a.version);
    });

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: highestVersion[0].language,
          version: highestVersion[0].version,
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const result = await response.json();
      console.log("Code execution result", result);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const processedOutput = result.run.output.replace(/\\n/g, "\n");
      setCodeEditorOutput((prevEntries) => [
        {
          output: processedOutput,
          timestamp,
          error: result.run.code === 1 ? true : false,
        },
        ...prevEntries,
      ]);
      setIsCodeExecutionRunning(false);
      setShowTerminal(true);
    } catch (error) {
      toast.error("Error executing code. Please try again.");
      console.error("Error executing code:", error);
    }
  };

  const tabsData = [
    {
      label: "Code Editor",
      content: (
        <CodeEditor
          codeEditorRef={codeEditorRef}
          socketRef={socketRef}
          roomId={roomId}
          codeEditorContent={codeEditorContent}
          setCodeEditorContent={setCodeEditorContent}
          codeEditorOutput={codeEditorOutput}
          setCodeEditorOutput={setCodeEditorOutput}
          pistonSupportedRuntimes={pistonSupportedRuntimes}
          filesData={filesData}
          setFilesData={setFilesData}
          runCode={runCode}
          showTerminal={showTerminal}
          setShowTerminal={setShowTerminal}
          isCodeExecutionRunning={isCodeExecutionRunning}
          openCollaborationPopup={openCollaborationPopup}
          setOpenCollaborationPopup={setOpenCollaborationPopup}
        />
      ),
    },
    {
      label: "Canvas",
      content: (
        <Canvas
          username={!location.state ? username : location.state.username}
          roomId={roomId}
          editorRef={editorRef}
        />
      ),
    },
    {
      label: "Text Editor",
      content: (
        <TextEditor
          socketRef={socketRef}
          textContent={textContent}
          setTextContent={setTextContent}
        />
      ),
    },
  ];

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      {showLoader && !isSolo && <CodeboardLoader />}
      {showModal && !isSolo && (
        <div className="absolute top-0 z-50 w-full h-full overflow-y-hidden opacity-95 bg-white-300 backdrop-blur-sm bg-opacity-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[15%] left-1/3 transform -translate-x-1/2 max-w-xl w-full px-4"
          >
            <NameModal handleJoinClick={handleModalJoinClick} />
          </motion.div>
        </div>
      )}

      <Tabs
        tabs={tabsData}
        clients={clients}
        socketRef={socketRef}
        editorRef={editorRef}
        messages={messages}
        codeBoardBotResults={codeBoardBotResults}
        setCodeBoardBotResults={setCodeBoardBotResults}
        isLoadingImg={isLoadingImg}
        setIsLoadingImg={setIsLoadingImg}
        isLoadingContent={isLoadingContent}
        setIsLoadingContent={setIsLoadingContent}
        pistonSupportedRuntimes={pistonSupportedRuntimes}
        isSolo={isSolo}
        setOpenCollaborationPopup={setOpenCollaborationPopup}
      />
    </div>
  );
}

export default EditorPage;

function CodeboardLoader() {
  return (
    <div className="absolute z-50 w-screen h-screen overflow-y-hidden opacity-95 bg-white-300 backdrop-blur-sm bg-opacity-10">
      <div className="fixed z-50 flex flex-col items-center w-full top-[40%] gap-2 font-Montserrat">
        <div
          className="h-12 w-12 animate-spin rounded-full border-[6px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
        <span className="text-[14px] font-mono w-max text-center">
          Connecting to server.
          <br />
          Please wait...
        </span>
      </div>
    </div>
  );
}
