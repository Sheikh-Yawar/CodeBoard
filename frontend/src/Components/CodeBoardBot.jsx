import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { exportToBlob } from "tldraw";
import { SettingsContext } from "../../context/SettingsContext";
import CodeMirror from "@uiw/react-codemirror";
import * as themes from "@uiw/codemirror-themes-all";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { EditorView } from "@uiw/react-codemirror";
import { color } from "@uiw/codemirror-extensions-color";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import copy from "copy-to-clipboard";
import TextareaAutosize from "react-textarea-autosize";
const serverURL = import.meta.env.VITE_SERVER_URL;

const CodeBoardBot = ({
  activeTab,
  editorRef,
  codeBoardBotResults,
  setCodeBoardBotResults,
  isLoadingImg,
  setIsLoadingImg,
  isLoadingContent,
  setIsLoadingContent,
}) => {
  const [userInstructions, setUserInstructions] = useState("");

  async function handleCalulateClick() {
    if (isLoadingImg) return; // Prevent multiple clicks while loading
    setIsLoadingImg(true);
    const editor = editorRef.current; // Access editor from ref

    if (!editor) {
      console.error("Editor is not initialized yet.");
      return;
    }

    const shapeIds = editor.store.query.ids("shape"); // Get the shape IDs from the current page
    if (shapeIds.length === 0) {
      alert("No shapes on the canvas");
      return;
    }

    let blob;
    try {
      blob = await exportToBlob({
        editor,
        ids: shapeIds,
        format: "png",
        opts: { background: true }, // Customize options if needed
      });
    } catch (error) {
      toast.error("Oops! Something went wrong.");
    }

    const formData = new FormData();
    formData.append("file", blob, "canvas_image.png");

    try {
      const response = await fetch(`${serverURL}/analyze-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send image to server");
      }

      const result = await response.json();

      console.log("Result from server", result);

      let formattedResult =
        typeof result === "string" &&
        result.startsWith("```") &&
        result.endsWith("```")
          ? result.slice(result.indexOf("\n") + 1, -3) // Remove backticks and initial line (e.g., "python")
          : result;

      formattedResult = formattedResult.replace(/'/g, '"');

      let explanationMatch = formattedResult.match(
        /"explanation":\s*"(.*?)",\s*"expr"/s
      );

      let exprMatch = formattedResult.match(/"expr":\s*"(.*?)",\s*"result"/s);

      let answerMatch = formattedResult.match(/"result":\s*(\d+)/);

      // Extract the values
      let explanation = explanationMatch
        ? explanationMatch[1]
        : "No explanation found.";
      let processedExplanation = explanation.replace(/\\n/g, "\n");
      let expr = exprMatch ? exprMatch[1] : "No expression found.";
      let answer = answerMatch ? answerMatch[1] : "No answer found.";

      setCodeBoardBotResults((prevResults) => ({
        ...prevResults,
        imageAnalysisResult: [
          { expr, answer, explanation: processedExplanation },
          ...prevResults.imageAnalysisResult,
        ],
      }));
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      console.error("Something went wrong:", error);
    }
    setIsLoadingImg(false);
  }

  async function handleSendClick() {
    if (isLoadingContent) return; // Prevent multiple clicks while loading
    setIsLoadingContent(true);

    try {
      const response = await fetch(`${serverURL}/generate-content`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ userInstructions }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const result = await response.json();

      console.log("Result from server", result);

      let formattedResult =
        typeof result === "string" &&
        result.startsWith("```") &&
        result.endsWith("```")
          ? result.slice(result.indexOf("\n") + 1, -3) //
          : result;

      formattedResult = formattedResult.replace(/'/g, '"');

      let explanationMatch = formattedResult.match(
        /"explanation":\s*"(.*?)",\s*"code"/s
      );
      let codeMatch = formattedResult.match(/"code":\s*"(.*?)",\s*"content"/s);

      // Update the regex to match string content correctly
      let contentMatch = formattedResult.match(/"content":\s*"(.*?)"\s*}/s);

      // Extract the values
      let explanation = explanationMatch
        ? explanationMatch[1]
        : "No explanation found.";
      let processedExplanation = explanation.replace(/\\n/g, "\n");
      let code = codeMatch ? codeMatch[1] : "No code found";
      let processedCode = code.replace(/\\n/g, "\n"); // Replace '\n' with actual newline
      let content = contentMatch ? contentMatch[1] : "No content found.";
      let processedContent = content.replace(/\\n/g, "\n");

      setCodeBoardBotResults((prevResults) => ({
        ...prevResults,
        contentGenerationResults: [
          {
            explanation: processedExplanation,
            code: processedCode,
            content: processedContent,
          },
          ...prevResults.contentGenerationResults,
        ],
      }));
    } catch (error) {
      toast.error("Oops! Something went wrong.");
      console.error("Something went wrong:", error);
    }
    setUserInstructions("");
    setIsLoadingContent(false);
  }
  return (
    <div className="p-3 text-[13px] text-gray-300 h-[98vh] ">
      {activeTab === 1 ? (
        <div>
          <div>
            <p>
              Calculate the result of any mathimatical expression that might be
              there in your canvas
            </p>
            <button
              onClick={handleCalulateClick}
              className={`flex justify-center w-full p-2 mt-2 text-xl font-bold rounded ${
                isLoadingImg ? "cursor-not-allowed" : "cursor-pointer"
              } ${isLoadingImg ? "bg-gray-500" : "bg-primary text-background"}`}
            >
              {isLoadingImg ? "Calculating..." : "Calculate"}
            </button>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-5 "></div>
          <div className="h-[73vh] md:h-[79vh] overflow-y-scroll overflow-x-hidden">
            <div className="flex flex-col gap-2 mt-5 ">
              {codeBoardBotResults.imageAnalysisResult.length > 0 ? (
                codeBoardBotResults.imageAnalysisResult.map(
                  (resultObj, index) => (
                    <ImageAnalysisResult
                      key={index}
                      resultObj={resultObj}
                      sender="CodeBoardBot"
                      timestamp={new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  )
                )
              ) : (
                <ResultMessage
                  message="Hello! I'm CodeBoardBot, here to help you solve mathematical problems. Simply draw what you'd like to calculate on the canvas, add a question mark to the part you need help with, and I'll handle the rest!"
                  sender="CodeBoardBot"
                  timestamp={new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          <div>
            <TextareaAutosize
              value={userInstructions}
              className="w-full bg-transparent border mt-1 border-gray-300 rounded p-2 text-[16px resize-none outline-none font-semibold overflow-scroll"
              maxRows={10}
              minRows={3}
              placeholder="I can help you generate, debug and enhance your code. Type your query here"
              onChange={(e) => setUserInstructions(e.target.value)}
            />
            <button
              onClick={handleSendClick}
              className={`flex justify-center w-full p-2 mt-2 text-xl font-bold rounded ${
                isLoadingContent ? "cursor-not-allowed" : "cursor-pointer"
              } ${
                isLoadingContent ? "bg-gray-500" : "bg-primary text-background"
              }`}
            >
              {isLoadingContent ? "Generating..." : "Send"}
            </button>
          </div>
          <div className="w-full h-[1px] bg-gray-300 my-5 "></div>
          <div className="flex flex-col h-[63vh] md:h-[70vh]  gap-2 overflow-x-hidden overflow-y-scroll">
            {codeBoardBotResults.contentGenerationResults.length > 0 ? (
              codeBoardBotResults.contentGenerationResults.map(
                (resultObj, index) => (
                  <ContentGenerationResult
                    key={index}
                    resultObj={resultObj}
                    activeTab={activeTab}
                    sender="CodeBoardBot"
                    timestamp={new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  />
                )
              )
            ) : (
              <ResultMessage
                message="Hello! I'm CodeBoardBot, your assistant for generating, debugging, and enhancing code. I can also craft stories, poems, and more. Just type your request, and I'll take care of the rest!"
                sender="CodeBoardBot"
                timestamp={new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function ResultMessage({ message, timestamp }) {
  return (
    <div
      className={`bg-secondary text-[16px] text-left p-2 rounded-lg  mx-1.5`}
    >
      <div className="flex justify-between pb-2">
        <span className="text-primary">CodeBoardBot</span>
        <span>{timestamp}</span>
      </div>
      {message}
    </div>
  );
}
function ImageAnalysisResult({ resultObj, timestamp }) {
  return (
    <div
      className={`bg-secondary text-[16px] text-left p-2 rounded-lg  mx-1.5`}
    >
      <div className="flex justify-between pb-2">
        <span className="text-primary">CodeBoardBot</span>
        <span>{timestamp}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="p-2 rounded bg-tabbar">
          <span className="pr-2 font-bold">Explanation:</span>
          {resultObj.explanation}
        </div>
        <div className="p-2 rounded bg-tabbar">
          <span className="pr-2 font-bold">Expression:</span>
          {resultObj.expr}
        </div>
        <div className="p-2 rounded bg-tabbar">
          <span className="pr-2 font-bold">Result:</span> {resultObj.answer}
        </div>
      </div>
    </div>
  );
}
function ContentGenerationResult({ resultObj, timestamp }) {
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [isCopiedContent, setIsCopiedContent] = useState(false);
  const settingsContext = useContext(SettingsContext);
  const handleCopyCode = () => {
    if (isCopiedCode) return;
    copy(resultObj.code);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 1000); // Reset copied state after 1.5 seconds
  };
  const handleCopyContent = () => {
    if (isCopiedContent) return;
    copy(resultObj.content);
    setIsCopiedContent(true);
    setTimeout(() => setIsCopiedContent(false), 1000); // Reset copied state after 1.5 seconds
  };

  return (
    <div
      className={`bg-secondary text-[16px] text-left p-2 rounded-lg  mx-1.5`}
    >
      <div className="flex justify-between pb-2">
        <span className="text-primary">CodeBoardBot</span>
        <span>{timestamp}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="p-2 rounded bg-tabbar">
          <span className="pr-2 font-bold">Explanation:</span>
          {resultObj.explanation}
        </div>
        {resultObj.code.length > 0 && (
          <div className="p-2 rounded bg-tabbar">
            <div className="cursor-pointer text-end" onClick={handleCopyCode}>
              {isCopiedCode ? "Copied!" : "Copy"}
            </div>
            <CodeMirror
              value={resultObj.code}
              extensions={[
                loadLanguage(settingsContext.settings.language),
                color,
                hyperLink,
                EditorView.lineWrapping,
                EditorView.editable.of(false),
                EditorView.updateListener.of((update) => {
                  if (update.docChanged) {
                    const view = update.view;
                    // Scroll to the bottom after changes
                    view.dispatch({
                      effects: EditorView.scrollIntoView(view.state.doc.length),
                    });
                  }
                }),
              ]}
              theme={themes[settingsContext.settings.theme]}
              style={{ fontSize: "20px" }}
            />
          </div>
        )}
        {resultObj.content.length > 0 && (
          <div className="p-2 rounded bg-tabbar">
            <div
              className="cursor-pointer text-end"
              onClick={handleCopyContent}
            >
              {isCopiedContent ? "Copied!" : "Copy"}
            </div>
            {resultObj.content}
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeBoardBot;
