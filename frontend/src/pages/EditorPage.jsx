import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useBlocker, useLocation, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SettingsContext } from "../../context/SettingsContext";
import CodeMirror from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@uiw/react-codemirror";
import { color } from "@uiw/codemirror-extensions-color";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import Canvas from "../Components/Canvas";
import NameModal from "../Components/NameModal";
import Tabs from "../Components/Tabs";
import TextEditor from "../Components/TextEditor";

function EditorPage() {
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const codeEditorRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [username, setUsername] = useState("");
  const [codeBoardBotResults, setCodeBoardBotResults] = useState({
    imageAnalysisResult: [],
    contentGenerationResults: [],
  });
  const [isLoadingImg, setIsLoadingImg] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const settingsContext = useContext(SettingsContext);
  const location = useLocation();
  const { roomId } = useParams();
  const [editorContent, setEditorContent] = useState("");
  const [textContent, setTextContent] = useState("");
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const cursors = useRef([
    {
      socketId: "d7MabZNqs1lc2_qAAAAN",
      username: "nacheez",
      cursorColor: "#D6AF25",
      cursorData: { line: 4, ch: 0 },
    },
    {
      socketId: "OqrRzrwY4uKf7j3dAAAQ",
      username: "Yawar",
      cursorColor: "#6B5532",
      cursorData: { line: 1, ch: 0 },
    },
    {
      socketId: "pwrdzQzYjl5ayArIAAAR",
      username: "Kratos",
      cursorColor: "#77AE9F",
      cursorData: { line: 2, ch: 10 },
    },
    {
      socketId: "4d9mwDmm7-Fy22y3AAAT",
      username: "Yawar",
      cursorColor: "#E87D44",
      cursorData: { line: 1, ch: 19 },
    },
  ]);

  const handleEditorChange = (value) => {
    socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
    setEditorContent(value);
  };

  useEffect(() => {
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
      const currentUsername = !location.state
        ? sessionStorage.getItem("currentUsername")
        : location.state.username;

      settingsContext.updateSettings("userName", currentUsername);
      settingsContext.updateSettings("roomId", roomId);
      settingsContext.updateSettings("language", "javascript");
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
          setEditorContent(code);
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
          setEditorContent(roomData.code);
        }

        if (roomData && roomData.text.length > 0) {
          setTextContent(roomData.text);
        }
        if (roomData && roomData.messages.length > 0) {
          setMessages(roomData.messages);
        }
        if (roomData && roomData.selectedLanguage.length > 0) {
          settingsContext.updateSettings("language", roomData.selectedLanguage);
        }
      });

      // Handle cursor updates from other users
      socketRef.current.on(ACTIONS.CURSOR_UPDATE, (roomData) => {
        console.log("Room data is", roomData);
        updateCursors();
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

      socketRef.current.on(
        ACTIONS.LANGUAGE_CHANGE,
        ({ username, language }) => {
          settingsContext.updateSettings("language", language);
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
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [username]);

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

  const tabsData = [
    {
      label: "Code Editor",
      content: (
        <CodeMirror
          ref={codeEditorRef}
          value={editorContent}
          onChange={handleEditorChange}
          extensions={[
            loadLanguage(settingsContext.settings.language),
            color,
            hyperLink,
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const view = update.view;

                // Scroll to the bottom after changes
                view.dispatch({
                  effects: EditorView.scrollIntoView(view.state.doc.length),
                });
                // Get the current cursor position
                const cursorPos = update.state.selection.main.head; // Main cursor position
                const lineInfo = update.state.doc.lineAt(cursorPos);

                // Prepare data to send to server
                const cursorData = {
                  line: lineInfo.number,
                  ch: cursorPos - lineInfo.from,
                };

                socketRef.current.emit(ACTIONS.CURSOR_UPDATE, {
                  roomId,
                  cursorData,
                });
              }
            }),
          ]}
          theme={themes[settingsContext.settings.theme]}
          height={window.innerWidth < 768 ? "83vh" : "90vh"}
          width="96.3vw"
          style={{ fontSize: "20px" }}
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
      {showLoader && <CodeboardLoader />}
      {showModal && <NameModal handleJoinClick={handleModalJoinClick} />}
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
