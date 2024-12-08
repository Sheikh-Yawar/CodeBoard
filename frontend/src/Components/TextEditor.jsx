import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export default function TextEditor({
  textEditorContent,
  clients,
  docRef,
  providerRef,
  username,
  isSolo,
}) {
  const handleTextEditorChange = (value) => {
    if (isSolo) {
      localStorage.setItem(
        "blocknoteContent",
        JSON.stringify(value.document, null, 2)
      );
    }
  };
  return (
    <BlockNoteView
      className="w-full h-full pt-1 overflow-auto bg-[#1e1e1e]"
      onChange={handleTextEditorChange}
      editor={
        isSolo
          ? useCreateBlockNote({
              initialContent: textEditorContent,
            })
          : useCreateBlockNote({
              collaboration: {
                provider: providerRef.current,
                fragment: docRef.current.getXmlFragment("blocknote"),
                user: {
                  name: username,
                  color:
                    clients.find((client) => client.username === username)
                      ?.userColor ?? "#ff4000",
                },
              },
            })
      }
    />
  );
}
