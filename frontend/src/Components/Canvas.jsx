import { useEffect, useRef, useState } from "react";
import {
  Tldraw,
  DefaultColorThemePalette,
  exportToBlob,
  useTldrawUser,
} from "tldraw";
import { useSyncDemo } from "@tldraw/sync";

DefaultColorThemePalette.lightMode.black.solid = "white";

function Canvas({ roomId, username, editorRef }) {
  const [userPreferences, setUserPreferences] = useState({
    id: "user-" + Math.random(),
    name: username,
  });

  const user = useTldrawUser({ userPreferences, setUserPreferences });

  const store = useSyncDemo({
    roomId,
    userInfo: userPreferences,
  });

  return (
    <div className="w-full h-full">
      <Tldraw
        store={store}
        user={user}
        onMount={(editor) => {
          editorRef.current = editor;

          editor.user.updateUserPreferences({
            colorScheme: "dark",
            isSnapMode: true,
            isPasteAtCursorMode: true,
          });
        }}
      />
    </div>
  );
}

export default Canvas;
