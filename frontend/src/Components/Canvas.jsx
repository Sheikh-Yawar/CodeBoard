import { useEffect, useRef, useState } from "react";
import { Tldraw, DefaultColorThemePalette, useTldrawUser } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";

// Modify the default black color for light mode to white
DefaultColorThemePalette.lightMode.black.solid = "white";

function Canvas({ roomId, username, editorRef, isSolo }) {
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
      {isSolo ? (
        <Tldraw
          persistenceKey="canvasContent"
          onMount={(editor) => {
            editorRef.current = editor;
            editor.user.updateUserPreferences({
              colorScheme: "dark",
              isSnapMode: true,
              isPasteAtCursorMode: true,
            });
          }}
        />
      ) : (
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
      )}
    </div>
  );
}

export default Canvas;
