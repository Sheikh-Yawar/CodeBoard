import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { Toaster } from "react-hot-toast";
import { SettingsProvider } from "../context/SettingsContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/editor/:roomId",
      element: <EditorPage />,
    },
    {
      path: "*",
      element: <HomePage />,
    },
  ]);
  return (
    <div className="min-h-screen text-white dark min-w-screen font-Montserrat ">
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#3d404a",
            color: "white",
          },
        }}
      />
    </div>
  );
}

export default App;
