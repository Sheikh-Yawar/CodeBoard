import toast from "react-hot-toast";
import { exportToBlob } from "tldraw";

const CodeBoardBot = ({ showCanvas, editorRef }) => {
  async function handleCalulateClick() {
    console.log("Calculate Clicked");
    const editor = editorRef.current; // Access editor from ref

    if (!editor) {
      console.error("Editor is not initialized yet.");
      return;
    }

    const shapeIds = editor.store.query.ids("shape"); // Get the shape IDs from the current page
    console.log("Shape IDs", shapeIds);
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
        opts: { background: false }, // Customize options if needed
      });
    } catch (error) {
      toast.error("Error exporting canvas to image.");
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "canvas_image.png";
    link.click();
  }
  return (
    <div className="p-3 text-[13px] text-gray-300 h-[98vh] ">
      {showCanvas ? (
        <div>
          <div>
            <p>
              Calculate the result of any mathimatical expression that might be
              there in your canvas
            </p>
            <button
              onClick={handleCalulateClick}
              className="flex justify-center w-full p-2 mt-2 text-xl font-bold rounded cursor-pointer bg-primary text-background"
            >
              Calculate
            </button>
          </div>
          <div className="w-full h-[1px] bg-gray-300 mt-5"></div>
          <div className="flex flex-col gap-2 mt-5 ">
            <ResultMessage
              message="Hey, I am CodeBoardBot. I can help you solve mathematical problems. Just draw what you wnat to calculate on canvas and put a question mark on the part you need help with and I will do the rest."
              sender="CodeBoardBot"
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>
        </div>
      ) : (
        <div className="h-full">
          <div className="flex flex-col gap-2 h-[73vh] md:h-[79vh] overflow-y-scroll overflow-x-hidden">
            <ResultMessage
              message="Hey, I am CodeBoardBot. I can help you solve mathematical problems. Just draw what you wnat to calculate on canvas and put a question mark on the part you need help with and I will do the rest."
              sender="CodeBoardBot"
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <ResultMessage
              message="Hey, I am CodeBoardBot. I can help you solve mathematical problems. Just draw what you wnat to calculate on canvas and put a question mark on the part you need help with and I will do the rest."
              sender="CodeBoardBot"
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <ResultMessage
              message="Hey, I am CodeBoardBot. I can help you solve mathematical problems. Just draw what you wnat to calculate on canvas and put a question mark on the part you need help with and I will do the rest."
              sender="CodeBoardBot"
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <ResultMessage
              message="Hey, I am CodeBoardBot. I can help you solve mathematical problems. Just draw what you wnat to calculate on canvas and put a question mark on the part you need help with and I will do the rest."
              sender="CodeBoardBot"
              timestamp={new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>
          <div className="mt-5">
            <textarea
              className="w-full bg-transparent border mt-1 border-gray-300 rounded p-2 text-[16px resize-none outline-none font-semibold"
              placeholder="I can help you generate, debug and enhance your code. Type your query here"
              onPaste={(e) => {
                console.log("On Paste");
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text/plain");
                const lines = pastedText.split("\n");
                const maxRows = 7;
                const newRows = Math.min(lines.length, maxRows);
                e.target.rows = newRows;
                e.target.value = pastedText;

                if (lines.length > maxRows) {
                  e.target.style.overflowY = "scroll";
                }
              }}
              onInput={(e) => {
                console.log("On Input");

                const lines = e.target.value.split("\n");
                const maxRows = 7;
                let newRows = lines.length > 2 ? lines.length : 2;

                // Remove empty rows at the end
                while (newRows > 2 && lines[newRows - 1].trim() === "") {
                  newRows--;
                }

                newRows = Math.min(newRows, maxRows);
                e.target.rows = newRows;

                if (newRows < maxRows) {
                  e.target.style.overflowY = "hidden";
                }
              }}
            ></textarea>
            <button
              onClick={() => {}}
              className="flex justify-center w-full p-1 mt-2 text-xl font-bold rounded cursor-pointer bg-primary text-background"
            >
              Send
            </button>
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

export default CodeBoardBot;
