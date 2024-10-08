import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { SettingsContext } from "../../context/SettingsContext";
import Navbar from "../Components/Navbar";
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

function EditorPage() {
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [username, setUsername] = useState("");
  const settingsContext = useContext(SettingsContext);
  const location = useLocation();
  const { roomId } = useParams();
  const [editorContent, setEditorContent] = useState("");
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentTab, setCurrentTab] = useState("code");

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
      // Listening for code change
      socketRef.current.on(ACTIONS.SYNC_CHANGES, ({ roomData }) => {
        if (roomData) {
          console.log(roomData);
        }
        if (roomData && roomData.code !== null) {
          setEditorContent(roomData.code);
        }

        if (roomData && roomData.canvasData.length > 0) {
          setCanvasData(roomData.canvasData);
        }
        if (roomData && roomData.messages.length > 0) {
          setMessages(roomData.messages);
        }
        if (roomData && roomData.selectedLanguage.length > 0) {
          settingsContext.updateSettings("language", roomData.selectedLanguage);
        }
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

  function showCanvasfunc(val) {
    setShowCanvas(val);
  }

  function handleModalJoinClick(username) {
    if (username.length < 5 || username.length > 20) {
      return;
    }

    sessionStorage.setItem("currentUsername", username);
    setUsername(username);
    setShowModal(false);
  }

  function handleTabClick(icon) {
    switch (icon) {
      case "code":
        setCurrentTab(icon);
        break;
      case "canvas":
        setCurrentTab(icon);
        break;
      case "viewmembers":
        setCurrentTab(icon);
        break;
      case "chat":
        setCurrentTab(icon);
        break;
      case "settings":
        setCurrentTab(icon);
        break;
    }
  }

  const blocker = useCallback(() => {
    // Display a dialog box to the user.
    var message = "Are you sure you want to leave this page?";
    var result = window.confirm(message);

    // If the user clicks on the "Cancel" button, prevent the browser from navigating away from the page.
    return !result;
  }, []);

  useBlocker(blocker);

  return (
    <div>
      {showLoader && <CodeboardLoader />}
      {showModal && <NameModal handleJoinClick={handleModalJoinClick} />}
      <div className="flex">
        {!showModal && (
          <Navbar
            clients={clients}
            socketRef={socketRef}
            editorRef={editorRef}
            messages={messages}
            handleTabClick={handleTabClick}
            showCanvas={showCanvas}
            setShowCanvas={showCanvasfunc}
          />
        )}
        {showCanvas ? (
          <Canvas
            username={!location.state ? username : location.state.username}
            roomId={roomId}
            editorRef={editorRef}
          />
        ) : (
          <CodeMirror
            className="overflow-auto"
            value={editorContent}
            onChange={handleEditorChange}
            extensions={[
              loadLanguage(settingsContext.settings.language),
              color,
              hyperLink,
              EditorView.lineWrapping,
            ]}
            theme={themes[settingsContext.settings.theme]}
            width="100vw"
            height="100vh"
            style={{ fontSize: "20px" }}
          />
        )}
      </div>
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
