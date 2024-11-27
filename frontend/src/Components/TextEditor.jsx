import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

export default function TextEditor({
  clients,
  docRef,
  providerRef,
  username,
  isSolo,
}) {
  return (
    <BlockNoteView
      className="w-full h-full pt-1 overflow-auto bg-[#1e1e1e]"
      editor={
        isSolo
          ? useCreateBlockNote()
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
