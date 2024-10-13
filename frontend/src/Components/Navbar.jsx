import { MdOutlineChat } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import { FaCode } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { useState } from "react";
import ViewMembers from "./ViewMembers";
import Chat from "./Chat";
import Settings from "./Settings";
import CodeBoardBot from "./CodeBoardBot";
function Navbar({
  socketRef,
  editorRef,
  messages,
  clients,
  activeTab,
  codeBoardBotResults,
  setCodeBoardBotResults,
  isLoadingImg,
  setIsLoadingImg,
  isLoadingContent,
  setIsLoadingContent,
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastClickedIcon, setLastClickedIcon] = useState("code");

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

  return (
    <div className="flex">
      <div className="fixed bottom-0 left-0 z-50 flex items-center h-[50px] w-full gap-10 px-5 bg-tabbar md:static md:h-screen md:w-[50px] md:pt-14 md:min-w-[50px] md:flex-col md:p-2 cursor-pointer text-[#89919d]">
        <RiRobot3Fill
          title="Ask CodeBoardBot for help"
          className={`${
            lastClickedIcon === "codeboardbot" && "text-white scale-[2.2]"
          } scale-[1.7] `}
          onClick={() => handleCodeBoardBotClick("codeboardbot")}
        />

        <LiaUserFriendsSolid
          className={`${
            lastClickedIcon === "viewmembers" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handleViewMembersClick("viewmembers")}
        />
        <div className="relative" onClick={() => handleChatClick("chat")}>
          <MdOutlineChat
            className={`${
              lastClickedIcon === "chat" && " text-white scale-[2.2]"
            } scale-[1.6] `}
          />
        </div>
        <IoSettingsOutline
          className={`${
            lastClickedIcon === "settings" && "text-white  scale-[2.2]"
          } scale-[1.6] `}
          onClick={() => handleSettingsClick("settings")}
        />
      </div>

      <div
        className={`z-20 h-screen w-screen pt-5 flex-col bg-dark md:static md:w-[350px] bg-tabbar ${
          showSidebar ? "block" : "hidden"
        }`}
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
        {lastClickedIcon === "settings" && <Settings socketRef={socketRef} />}
        {lastClickedIcon === "viewmembers" && <ViewMembers clients={clients} />}
        {lastClickedIcon === "chat" && (
          <Chat socketRef={socketRef} messagesArray={messages} />
        )}
      </div>
    </div>
  );
}

export default Navbar;
