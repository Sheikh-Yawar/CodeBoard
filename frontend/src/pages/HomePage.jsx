import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const removeSpaces = (roomName) => {
    return roomName.replace(/\s/g, "");
  };

  const handleFormSubmit = () => {
    if (!roomId) {
      setError("Please Enter Room Id.");
      return;
    }
    if (!firstName) {
      setError("Please Enter First Name.");
      return;
    }

    if (removeSpaces(roomId).length < 5) {
      setError("Room Id cannot be less than 5 characters excluding spaces.");
      return;
    }

    navigate(`/editor/${removeSpaces(roomId)}`, {
      state: {
        username: firstName.trim() + " " + lastName.trim(),
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
        <div className="flex flex-col w-screen h-screen gap-8 lg:justify-evenly lg:flex-row bg-background font-Montserrat">
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
                  handleClick={() => console.log("Go Solo")}
                />
              </div>
            </>
          </div>
        </div>
      )}

      {showRoomForm && (
        <ParticlesBackground>
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
                  firstName={firstName}
                  setFirstName={setFirstName}
                  lastName={lastName}
                  setLastName={setLastName}
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
