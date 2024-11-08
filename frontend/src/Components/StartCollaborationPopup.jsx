import { v4 as uuidv4 } from "uuid";
import { cn } from "../../lib/utils";
import { Label } from "./External Components/RoomCreationForm/Label";
import { Input } from "./External Components/RoomCreationForm/Input";
import { useState } from "react";

export function StartCollaborationPopup({ setOpenCollaborationPopup }) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const handleCreateRoomClick = () => {
    if (roomId.trim() === "") return setError("Room Id cannot be empty.");

    window.open(
      `${window.location.origin}/editor/${roomId}`,
      "_blank",
      "noopener,noreferrer"
    );
    setRoomId("");
    setOpenCollaborationPopup(false);
  };
  return (
    <div className="w-full max-w-md p-4 mx-auto bg-white rounded-2xl shadow-input dark:bg-black/40">
      <div className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="roomId">Room Id</Label>
          <Input
            value={roomId}
            id="roomId"
            placeholder="roomId"
            type="text"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <p
            onClick={() => setRoomId(uuidv4())}
            className="text-[7px] text-userPrimary hover:underline cursor-pointer"
          >
            Create Room Id?
          </p>
        </LabelInputContainer>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setOpenCollaborationPopup(false);
            }}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Cancel
            <BottomGradient />
          </button>
          <button
            onClick={handleCreateRoomClick}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-800 dark:to-zinc-800 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Join Room &rarr;
            <BottomGradient />
          </button>
        </div>

        <p role="alert" className={"pt-2 text-[12px] text-center text-red-500"}>
          {error}
        </p>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 block w-full h-px transition duration-500 opacity-0 group-hover/btn:opacity-100 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="absolute block w-1/2 h-px mx-auto transition duration-500 opacity-0 group-hover/btn:opacity-100 blur-sm -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
