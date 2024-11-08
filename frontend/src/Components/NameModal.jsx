import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "../../lib/utils";
import { Label } from "./External Components/RoomCreationForm/Label";
import { Input } from "./External Components/RoomCreationForm/Input";

// function NameModal({ handleJoinClick }) {
//   return (
//     <>
//       <div className="absolute z-50 w-screen h-screen overflow-y-hidden opacity-95 bg-white-300 backdrop-blur-sm bg-opacity-10">
//         <div className=" fixed sm:left-[25%] md:top-[25%] md:left-[35%] top-[20%] z-50 justify-center items-center w-full font-Montserrat">
//           <div className="relative w-full max-w-md max-h-full p-4">
//             <div className="relative rounded-lg shadow bg-background">
//               <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Hang On!
//                 </h3>
//               </div>

//               <div className="p-4 md:p-5">
//                 <div className="pb-3">
//                   <p className="text-[15px] font-mono">
//                     Your presence requires a name.
//                   </p>
//                   <input
//                     className="bg-secondary border-[#89919d] border-[1px] rounded py-2 text-xl font-bold px-2 outline-none placeholder:font-normal w-full"
//                     value={username}
//                     onChange={(e) => {
//                       setUsername(e.target.value);
//                     }}
//                     onKeyUp={(e) => {
//                       if (e.code === "Enter") {
//                         handleJoinClick(username);
//                       }
//                     }}
//                     type="text"
//                     placeholder="Username"
//                   />
//                 </div>

//                 <button
//                   onClick={() => {
//                     handleJoinClick(username);
//                   }}
//                   className={`py-2 text-xl rounded ${
//                     username.length > 4 && username.length < 20
//                       ? "bg-primary cursor-pointer"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }  w-full `}
//                 >
//                   Join
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

export function NameModal({ handleJoinClick }) {
  const [username, setUsername] = useState("");
  return (
    <div className="w-full max-w-md p-4 mx-auto bg-white rounded-2xl md:p-8 shadow-input dark:bg-black">
      <LabelInputContainer className="mb-4">
        <Label htmlFor="username">Your presence requires a name.</Label>
        <Input
          id="username"
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => {
            if (e.target.value.length > 20) return;
            setUsername(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              handleJoinClick(username);
            }
          }}
        />
      </LabelInputContainer>
      <button
        onClick={() => {
          handleJoinClick(username);
        }}
        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        Join Room &rarr;
        <BottomGradient />
      </button>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />
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

export default NameModal;
