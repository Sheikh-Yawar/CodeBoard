import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

function Message({ message, sender, timestamp }) {
  const settingsContext = useContext(SettingsContext);
  const formattedSender =
    sender === settingsContext.settings.username ? "You" : sender;
  return (
    <div
      className={`bg-secondary text-[16px] text-left w-[75%] p-2 rounded-lg ${
        formattedSender === "You" ? "self-end" : "self-start"
      } mx-1.5`}
    >
      <div className="flex justify-between pb-2 text-[14px]">
        <span className="text-[#89919d]">{formattedSender}</span>
        <span className="text-[#89919d]">{timestamp}</span>
      </div>
      {message}
    </div>
  );
}

export default Message;
