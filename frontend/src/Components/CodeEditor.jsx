import Editor from "@monaco-editor/react";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TbGripHorizontal } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GrClear } from "react-icons/gr";

import ACTIONS from "../Actions";
const CodeEditor = ({
  codeEditorRef,
  codeEditorContent,
  setCodeEditorContent,
  socketRef,
  roomId,
  codeEditorOutput,
  setCodeEditorOutput,
}) => {
  const handleEditorChange = (value) => {
    socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: value });
    setCodeEditorContent(value);
  };
  const handleEditorMount = (editor) => {
    codeEditorRef.current = editor;
    editor.focus();
  };
  const settingsContext = useContext(SettingsContext);
  return (
    <PanelGroup direction="vertical">
      <Panel id="top" order={1}>
        <Editor
          className="text-5xl"
          language={settingsContext.settings.language}
          theme={settingsContext.settings.theme}
          defaultValue="// some comment"
          onMount={handleEditorMount}
          value={codeEditorContent}
          onChange={handleEditorChange}
          options={{
            fontSize: 17,
            wordWrap: "on",
            formatOnPaste: true,
          }}
        />
      </Panel>
      {settingsContext.settings.showTerminal && (
        <>
          <PanelResizeHandle className="flex items-end justify-center ">
            <TbGripHorizontal />
          </PanelResizeHandle>
          <Panel id="bottom" maxSizePercentage={80} order={2}>
            <div className="flex w-full h-[85%] md:h-full overflow-scroll bg-tabbar">
              <div className="w-full h-fit">
                {codeEditorOutput.length > 0 ? (
                  codeEditorOutput.map((entry, index) => {
                    return (
                      <div key={index} className="text-[11px] p-2">
                        <span className="pr-2 font-bold text-primary">
                          {entry.timestamp} CODERUNNER:
                        </span>
                        <span className={`${entry.error && "text-red-500"}`}>
                          {entry.output}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <span className="p-2 font-bold text-primary text-[11px]">
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
                  onClick={() =>
                    settingsContext.updateSettings("showTerminal", false)
                  }
                />
              </div>
            </div>
          </Panel>
        </>
      )}
    </PanelGroup>
  );
};
export default CodeEditor;
