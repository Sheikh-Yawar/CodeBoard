import { MdLogout, MdOutlineChat } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import {
  FaPlay,
  FaRegCopy,
  FaRegShareSquare,
  FaShareAltSquare,
} from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";

import { RiRobot3Fill } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import ViewMembers from "./ViewMembers";
import Chat from "./Chat";
import Settings from "./Settings";
import CodeBoardBot from "./CodeBoardBot";
import { SettingsContext } from "../../context/SettingsContext";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Resizable } from "re-resizable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Sidebar({
  className,
  socketRef,
  editorRef,
  messages,
  clients,
  activeTab,
  userColor,
  codeBoardBotResults,
  setCodeBoardBotResults,
  isLoadingImg,
  setIsLoadingImg,
  isLoadingContent,
  setIsLoadingContent,
  pistonSupportedRuntimes,
  isSolo,
  setOpenCollaborationPopup,
}) {
  const settingsContext = useContext(SettingsContext);
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastClickedIcon, setLastClickedIcon] = useState("code");
  const [sidebarWidth, setSidebarWidth] = useState(350);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        setSidebarWidth(windowWidth - 50);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCollaborationClick = () => {
    setOpenCollaborationPopup(true);
  };

  function handleViewMembersClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
  }
  function handleChatClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
  }

  function handleSettingsClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
  }

  function handleCodeBoardBotClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
  }

  const sidebarVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: sidebarWidth, opacity: 1, transition: { duration: 0.5 } },
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  return (
    <div className="flex">
      <div
        className={cn(
          " dark:bg-black flex items-center gap-10 px-5 bg-tabbar  flex-col p-2 cursor-pointer text-[#89919d]",
          className
        )}
      >
        <RiRobot3Fill
          title="Ask CodeBoardBot for help"
          className={`${
            lastClickedIcon === "codeboardbot" && "text-white scale-[2.2]"
          } scale-[1.7] hover:text-white`}
          onClick={() => handleCodeBoardBotClick("codeboardbot")}
        />

        {!isSolo && (
          <LiaUserFriendsSolid
            className={`${
              lastClickedIcon === "viewmembers" && "text-white scale-[2.2]"
            } scale-[2] hover:text-white`}
            onClick={() => handleViewMembersClick("viewmembers")}
          />
        )}
        {!isSolo && (
          <div className="relative" onClick={() => handleChatClick("chat")}>
            <MdOutlineChat
              className={`${
                lastClickedIcon === "chat" && " text-white scale-[2]"
              } scale-[1.6] hover:text-white `}
            />
          </div>
        )}

        {isSolo && (
          <FaShareAltSquare
            onClick={handleCollaborationClick}
            title="Start Collaboration"
            className="hover:text-white scale-[1.5] "
          />
        )}

        {!isSolo && (
          <FaRegCopy
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Copied to clipboard!", { position: "top-center" });
            }}
            title="Copy URL"
            className="hover:text-white scale-[1.5] "
          />
        )}
        {!isSolo && (
          <MdLogout
            onClick={() => {
              navigate("/", { replace: true });
            }}
            title="Exit Room"
            className="hover:text-white scale-[1.5] "
          />
        )}
        {/* <IoSettingsOutline
          className={`${
            lastClickedIcon === "settings" && "text-white  scale-[2.2]"
          } scale-[1.6] `}
          onClick={() => handleSettingsClick("settings")}
        /> */}
      </div>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className={`z-20 h-screen flex-col bg-dark dark:bg-black overflow-y-auto`}
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Resizable
              className="w-full"
              size={{ width: sidebarWidth, height: "100%" }}
              onResizeStop={debounce((e, direction, ref, d) => {
                setSidebarWidth((prevWidth) => prevWidth + d.width);
              }, 100)}
              enable={{
                top: false,
                right: true,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }}
            >
              {lastClickedIcon === "codeboardbot" && (
                <CodeBoardBot
                  activeTab={activeTab}
                  editorRef={editorRef}
                  codeBoardBotResults={codeBoardBotResults}
                  setCodeBoardBotResults={setCodeBoardBotResults}
                  isLoadingImg={isLoadingImg}
                  setIsLoadingImg={setIsLoadingImg}
                  isLoadingContent={isLoadingContent}
                  setIsLoadingContent={setIsLoadingContent}
                />
              )}
              {lastClickedIcon === "settings" && (
                <Settings
                  socketRef={socketRef}
                  pistonSupportedRuntimes={pistonSupportedRuntimes}
                />
              )}
              {lastClickedIcon === "viewmembers" && (
                <ViewMembers clients={clients} />
              )}
              {lastClickedIcon === "chat" && (
                <Chat socketRef={socketRef} messagesArray={messages} />
              )}
            </Resizable>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sidebar;
