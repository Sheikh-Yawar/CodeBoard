import { v4 as uuidv4 } from "uuid";
import { cn } from "../../lib/utils";
import { Label } from "./External Components/RoomCreationForm/Label";
import { Input } from "./External Components/RoomCreationForm/Input";

export function RoomForm({
  roomId,
  setRoomId,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  error,
  handleFormSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    handleFormSubmit();
  };
  return (
    <div className="w-full max-w-md p-4 mx-auto bg-white rounded-2xl md:p-8 shadow-input dark:bg-black">
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              value={firstName}
              onChange={(e) => {
                if (e.target.value.length > 10) return;
                setFirstName(e.target.value);
              }}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              value={lastName}
              onChange={(e) => {
                if (e.target.value.length > 10) return;
                setLastName(e.target.value);
              }}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="text">Room ID</Label>
          <Input
            id="text"
            placeholder="my-room-1"
            type="text"
            value={roomId}
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

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Join Room &rarr;
          <BottomGradient />
        </button>

        <div className="pt-2 text-[12px] text-center text-red-500">{error}</div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />

        <div className="text-sm text-center text-gray-500">
          If the room id exisits, you will be redirected to the room. Otherwise
          a new room will be created or
          <span className="font-bold cursor-pointer text-userPrimary hover:underline">
            {" "}
            Go&nbsp;Solo?
          </span>
        </div>
      </form>
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
