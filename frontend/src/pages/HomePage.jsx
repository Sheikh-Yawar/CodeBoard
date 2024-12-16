import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { OrbitingCirclesCodeBoard } from "../Components/External Components/OrbitingCircles/OrbitingCirclesCodeBoard.jsx";
import { ShimmerButtonCodeBoard } from "../Components/External Components/ShimmerButton/ShimmerButtonCodeBoard.jsx";
import { TypewriterEffect } from "../Components/External Components/TypeWriter/TypewriterEffect.tsx";
import { RoomForm } from "../Components/RoomForm.jsx";
import { AnimatePresence, motion } from "framer-motion";
import { ParticlesBackground } from "../Components/External Components/Particles/ParticlesBackground.jsx";

function HomePage() {
  const words = [
    {
      text: "Your",
    },
    {
      text: "space",
    },
    {
      text: "to",
    },
    {
      text: "code,",
      className: "text-userPrimary dark:text-userPrimary",
    },
    {
      text: "write,",
      className: "text-userPrimary dark:text-userPrimary",
    },
    {
      text: "and",
    },
    {
      text: "create",
      className: "text-userPrimary dark:text-userPrimary",
    },
    {
      text: "together",
    },
  ];
  const navigate = useNavigate();
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const removeSpaces = (roomName) => {
    return roomName.replace(/\s/g, "");
  };

  const handleFormSubmit = () => {
    if (!roomId) {
      setError("Please Enter Room Id.");
      return;
    }

    if (!username) {
      setError("Please Enter Username.");
      return;
    }

    if (removeSpaces(roomId).length < 5) {
      setError("Room Id cannot be less than 5 characters excluding spaces.");
      return;
    }

    navigate(`/editor/${removeSpaces(roomId)}`, {
      state: {
        username: username.trim(),
      },
    });
  };

  window.addEventListener("popstate", (e) => {
    if (e.state.idx === 1) {
      navigate("/", { replace: true });
    }
  });

  return (
    <>
      {!showRoomForm && (
        <div className="flex flex-col w-screen h-screen gap-8 overflow-hidden lg:justify-evenly lg:flex-row bg-background font-Montserrat">
          <OrbitingCirclesCodeBoard className="h-[55%] lg:h-full" />

          <div className="flex flex-col items-center px-4 lg:justify-center">
            <>
              <TypewriterEffect
                words={words}
                cursorClassName="bg-userPrimary"
              />
              <div className="flex gap-2 pt-5 md:gap-5">
                <ShimmerButtonCodeBoard
                  buttonLabel="Start Collaboration"
                  handleClick={() => setShowRoomForm(true)}
                />
                <ShimmerButtonCodeBoard
                  buttonLabel="Go Solo"
                  handleClick={() => navigate("/editor")}
                />
              </div>
              <div className="mt-48 text-sm text-gray-500">
                Developed by{" "}
                <Link
                  className="hover:border-b-[2px] border-userPrimary"
                  target="_blank"
                  rel="noopener noreferrer"
                  to="https://www.linkedin.com/in/sheikh-yawar-56022a193/"
                >
                  Sheikh Yawar
                </Link>
              </div>
            </>
          </div>
        </div>
      )}

      {showRoomForm && (
        <ParticlesBackground className="w-screen h-screen">
          <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 max-w-xl w-full px-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <RoomForm
                  roomId={roomId}
                  setRoomId={setRoomId}
                  username={username}
                  setUsername={setUsername}
                  error={error}
                  setError={setError}
                  handleFormSubmit={handleFormSubmit}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </ParticlesBackground>
      )}
    </>
  );
}

export default HomePage;
