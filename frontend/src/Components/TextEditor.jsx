import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useContext, useEffect, useState, useRef } from "react";
import ACTIONS from "../Actions";
import { SettingsContext } from "../../context/SettingsContext";

export default function TextEditor({ socketRef, textContent, setTextContent }) {
  const [markdown, setMarkdown] = useState("");
  const settingsContext = useContext(SettingsContext);
  const previousContent = useRef(""); // To store previous content and avoid unnecessary updates

  // Creates a new editor instance.
  const editor = useCreateBlockNote();

  useEffect(() => {
    async function loadTextFromServer() {
      // Compare the new content with the previous content to avoid unnecessary updates

      const blocks = await editor.tryParseMarkdownToBlocks(textContent);
      editor.replaceBlocks(editor.document, blocks);
      previousContent.current = textContent; // Update previous content reference
    }
    loadTextFromServer();
  }, [textContent, editor]); // Only run when textContent changes

  const handleTextEditorChange = async () => {
    console.log("Text editor changed!");
    const markdown = await editor.blocksToMarkdownLossy(editor.document);

    if (markdown !== previousContent.current) {
      console.log("Emitting TEXT_CHANGE event...");
      socketRef.current.emit(ACTIONS.TEXT_CHANGE, {
        roomId: settingsContext.settings.roomId,
        text: markdown,
      });

      previousContent.current = markdown;
    }
    console.log("Event emitted...");
  };

  return (
    <BlockNoteView
      className="w-full h-full pt-1 overflow-auto"
      editor={editor}
      onChange={handleTextEditorChange}
    />
  );
}
