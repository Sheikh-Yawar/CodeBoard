import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TbGripHorizontal } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GrClear } from "react-icons/gr";
import { FaSquarePlus } from "react-icons/fa6";
import { AddFilePopup } from "./AddFilePopup";
import { toast } from "react-hot-toast";
import { StartCollaborationPopup } from "./StartCollaborationPopup";
const serverURL = import.meta.env.VITE_SERVER_URL;

const CodeEditor = ({
  codeEditorRef,
  codeEditorContent,
  setCodeEditorContent,
  socketRef,
  roomId,
  docRef,
  providerRef,
  username,
  isSolo,
  codeEditorOutput,
  setCodeEditorOutput,
  pistonSupportedRuntimes,
  filesData,
  setFilesData,
  runCode,
  showTerminal,
  setShowTerminal,
  isCodeExecutionRunning,
  openCollaborationPopup,
  setOpenCollaborationPopup,
}) => {
  const existingFileIndex = useRef(-1);
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("");
  const [activeTabData, setActiveTabData] = useState({
    runCodeOption: true,
    index: 0,
  });
  const [isAddingFile, setIsAddingNewFile] = useState(false);
  const localUser = useRef({
    id: Math.random(),
    name: username, // Replace with your username
    color: getRandomColor(),
  });
  const awarenessRef = useRef(null);
  const fileMapRef = useRef(null);

  // Monitor for username changes and update local state
  useEffect(() => {
    if (!isSolo && username && awarenessRef.current) {
      localUser.current.name = username;
      awarenessRef.current.setLocalState({ ...localUser.current });
    }
  }, [username, awarenessRef.current]);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    index: 0,
  });
  const contextMenuRef = useRef(null);

  const handleRightClick = (e, index) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      index,
    });
  };

  const handleContextMenuClickOutside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const handleEditorChange = (value) => {
    console.log("Handling local changes", isSolo);
    filesData[activeTabData.index].content = value;
    localStorage.setItem("codeEditorContent", JSON.stringify(filesData));
  };

  const initializeFilesData = () => {
    if (!fileMapRef.current) return;

    filesData.forEach((file, index) => {
      // Check if the file already has a Y.Text in the Y.Map
      if (!fileMapRef.current.has(file.fileName)) {
        const yText = new Y.Text(file.content || " "); // Initialize with existing content
        fileMapRef.current.set(file.fileName, yText); // Add to Y.Map
      }
    });
  };

  const handleEditorMount = (editor) => {
    console.log(
      "Handling Remote changes intialization started outiside providerref"
    );
    if (providerRef && providerRef.current) {
      console.log("Handling Remote changes intialization started");
      const codeEditorRef = { current: editor };
      const provider = providerRef.current;

      provider.on("status", (status) => {
        console.log("Status is", status);
      });
      provider.on("sync", (isSync) => console.log("WebSocket sync:", isSync));

      const awareness = provider.awareness;
      awarenessRef.current = awareness;

      // fileMapRef.current = docRef.current.getText("files");
      // initializeFilesData();
      // console.log("File Map Content:", Array.from(fileMapRef.current.entries()));
      const type = docRef.current.getText("monaco");
      // // Monaco-Yjs binding
      const binding = new MonacoBinding(
        type,
        editor.getModel(),
        new Set([editor]),
        awarenessRef.current
      );
    }
  };

  // Helper to generate random user colors
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  const handleAddFile = () => {
    if (!isSolo) {
      toast(
        "The multi-file feature is currently available only in solo mode. We're actively working on bringing it to collaborative mode soon.",
        { icon: "⚒️" }
      );
      return;
    }
    existingFileIndex.current = -1;
    setIsAddingNewFile(true);
  };

  const handleRunCodeClick = () => {
    const content =
      isSolo === true
        ? isSolo && filesData[activeTabData.index].content
        : docRef.current.getText("monaco").toString();

    if (content.length === 0) {
      toast("Please enter some code to execute.", { icon: "🥲" });
      return;
    }
    runCode(filesData[activeTabData.index].language, content);
  };

  const settingsContext = useContext(SettingsContext);
  return (
    <div
      className="relative w-full h-full"
      onClick={handleContextMenuClickOutside}
    >
      <PanelGroup direction="vertical">
        <Panel id="top" order={1}>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1 ">
            <div className="relative flex flex-wrap gap-1">
              {filesData.length > 0 &&
                filesData.map((fileData, index) => {
                  return (
                    <span
                      onContextMenu={(e) => handleRightClick(e, index)}
                      onClick={() =>
                        setActiveTabData({
                          runCodeOption: fileData.runCodeOption,
                          index,
                        })
                      }
                      key={index}
                      className={`flex text-[12px] items-center gap-2 px-2 font-medium border border-gray-600 rounded-sm cursor-pointer select-none ${
                        activeTabData.index === index
                          ? " border-b-2 border-b-userPrimary bg-white/[0.1] "
                          : ""
                      }`}
                    >
                      {fileData.fileName}
                    </span>
                  );
                })}
              <FaSquarePlus
                title="Add File"
                onClick={handleAddFile}
                className="self-center text-[18px] cursor-pointer hover:text-white/80"
              />

              {contextMenu.visible && (
                <div
                  ref={contextMenuRef}
                  className="absolute z-10 text-[12px] border rounded shadow-md dark:bg-background"
                  style={{ left: contextMenu.x - 70, top: contextMenu.y - 40 }}
                >
                  <div
                    className="px-4 py-1 cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      existingFileIndex.current = contextMenu.index;
                      setContextMenu({ ...contextMenu, visible: false });
                      setFileName(
                        `${filesData[contextMenu.index].fileName.split(".")[0]}`
                      );
                      setLanguage(filesData[contextMenu.index].language);
                      setIsAddingNewFile(true);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="px-4 py-1 cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      setShowTerminal(true);
                    }}
                  >
                    Terminal
                  </div>
                  <div
                    className="px-4 py-1 cursor-pointer hover:bg-red-500"
                    onClick={() => {
                      if (filesData.length === 1) {
                        toast.error("You can't delete the last file.", {
                          icon: "🥲",
                        });
                        setContextMenu({ ...contextMenu, visible: false });
                        return;
                      }
                      const updatedFilesData = [
                        ...filesData.slice(0, contextMenu.index),
                        ...filesData.slice(contextMenu.index + 1),
                      ];

                      setFilesData(updatedFilesData);

                      setContextMenu({ ...contextMenu, visible: false });
                      setActiveTabData({
                        ...activeTabData,
                        index:
                          contextMenu.index - 1 < 0 ? 0 : contextMenu.index - 1,
                      });
                      localStorage.setItem(
                        "codeEditorContent",
                        JSON.stringify(updatedFilesData)
                      );
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
            {activeTabData.runCodeOption && (
              <button
                onClick={handleRunCodeClick}
                className="text-[12px]  font-medium border dark:border-white/[0.2] px-2 py-[4px] cursor-pointe rounded-sm hover:bg-userPrimary"
              >
                {isCodeExecutionRunning ? <Spinner /> : "Run Code"}
              </button>
            )}
          </div>
          {isSolo && (
            <Editor
              className="text-5xl"
              language={filesData[activeTabData.index].language}
              theme={settingsContext.settings.theme}
              value={filesData[activeTabData.index].content}
              onChange={handleEditorChange}
              options={{
                fontSize: 17,
                wordWrap: "on",
                formatOnPaste: true,
              }}
            />
          )}
          {!isSolo && username && (
            <Editor
              className="text-5xl"
              language={filesData[activeTabData.index].language}
              theme={settingsContext.settings.theme}
              onMount={handleEditorMount}
              options={{
                fontSize: 17,
                wordWrap: "on",
                formatOnPaste: true,
              }}
            />
          )}
        </Panel>
        {showTerminal && (
          <>
            <PanelResizeHandle className="flex items-end justify-center ">
              <TbGripHorizontal />
            </PanelResizeHandle>
            <Panel id="bottom" maxSizePercentage={80} order={2}>
              <div className="flex w-full h-[85%] md:h-full overflow-scroll dark:bg-black">
                <div className="w-full h-fit">
                  {codeEditorOutput.length > 0 ? (
                    codeEditorOutput.map((entry, index) => {
                      return (
                        <div key={index} className="text-[11px] p-2">
                          <span className="pr-2 font-bold text-userPrimary">
                            {entry.timestamp} CODERUNNER:
                          </span>
                          <span className={`${entry.error && "text-red-500"}`}>
                            {entry.output}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="p-2 font-bold text-userPrimary text-[11px]">
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}{" "}
                      CODERUNNER:
                    </span>
                  )}
                </div>
                <div className="flex">
                  <GrClear
                    title="Clear Terminal"
                    className="m-2 text-[18px] cursor-pointer hover:text-primary"
                    onClick={() => setCodeEditorOutput([])}
                  />
                  <IoMdCloseCircleOutline
                    title="Close Terminal"
                    className="m-2 text-xl cursor-pointer hover:text-red-500"
                    onClick={() => setShowTerminal(false)}
                  />
                </div>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>

      {isAddingFile && (
        <div className="absolute top-0 z-50 w-full h-full overflow-y-hidden opacity-95 bg-white-300 backdrop-blur-sm bg-opacity-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[15%] left-1/3 transform -translate-x-1/2 max-w-xl w-full px-4"
          >
            <AddFilePopup
              setFilesData={setFilesData}
              pistonSupportedRuntimes={pistonSupportedRuntimes}
              setIsAddingNewFile={setIsAddingNewFile}
              fileName={fileName}
              setFileName={setFileName}
              language={language}
              setLanguage={setLanguage}
              existingFileIndex={existingFileIndex}
            />
          </motion.div>
        </div>
      )}
      {openCollaborationPopup && (
        <div className="absolute top-0 z-50 w-full h-full overflow-y-hidden opacity-95 bg-white-300 backdrop-blur-sm bg-opacity-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[15%] left-1/3 transform -translate-x-1/2 max-w-xl w-full px-4"
          >
            <StartCollaborationPopup
              setOpenCollaborationPopup={setOpenCollaborationPopup}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

const Spinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        class="w-14 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-userPrimary"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>
  );
};

export default CodeEditor;
