import { cn } from "../../lib/utils";
import { Input } from "./External Components/RoomCreationForm/Input";
import { IoMdSend } from "react-icons/io";
import Message from "./Message";
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import ACTIONS from "../Actions";

function Chat({ socketRef, messagesArray }) {
  const [message, setMessage] = useState("");
  const settingsContext = useContext(SettingsContext);
  const messagesContainerRef = useRef(null); // Use a ref for the container

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
    }
  }, [messagesArray]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length === 0) return;
    socketRef.current.emit(ACTIONS.MESSAGE, {
      roomId: settingsContext.settings.roomId,
      message,
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 pr-3">
      <div className="pb-2 text-xl font-bol">Group Chat</div>
      <div
        ref={messagesContainerRef} // Add the ref to the container
        className="flex flex-col flex-grow gap-5 overflow-auto max-h-[calc(100vh-10rem)] mb-5"
      >
        {messagesArray.length > 0 &&
          messagesArray.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              sender={message.username}
              timestamp={message.timestamp}
            />
          ))}
      </div>
      <form onSubmit={handleMessageSubmit} className="flex">
        <LabelInputContainer className="">
          <Input
            value={message}
            placeholder="Enter Message"
            type="text"
            className="px-2 py-1 text-[15px] rounded-l"
            onChange={(e) => setMessage(e.target.value)}
          />
        </LabelInputContainer>
        <button
          type="submit"
          className="px-2 text-3xl text-[#89919d] hover:text-white "
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Chat;
