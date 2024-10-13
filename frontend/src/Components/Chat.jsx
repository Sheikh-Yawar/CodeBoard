import { IoMdSend } from "react-icons/io";
import Message from "./Message";
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import ACTIONS from "../Actions";
function Chat({ socketRef, messagesArray }) {
  const [message, setMessage] = useState("");
  const settingsContext = useContext(SettingsContext);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
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
    <div className="flex flex-col w-full h-[92vh] md:h-[96vh] p-2 ">
      <div className="pb-2 text-xl font-bold">Group Chat</div>
      <div className="flex flex-col flex-1 gap-5 overflow-auto ">
        {messagesArray.length > 0 &&
          messagesArray.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              sender={message.username}
              timestamp={message.timestamp}
            />
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleMessageSubmit} className="flex mt-2 ">
        <input
          value={message}
          type="text"
          className="w-full bg-[#3d404a] border-[#89919d] border-[1px] rounded-l text-xl py-1 px-2 outline-none"
          placeholder="Enter Message"
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 text-2xl rounded-r bg-primary"
        >
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}

export default Chat;
