import { v4 as uuidv4 } from "uuid";
import { cn } from "../../lib/utils";
import { Label } from "./External Components/RoomCreationForm/Label";
import { Input } from "./External Components/RoomCreationForm/Input";
import supportedLangs from "../data/supportedLanguages";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export function AddFilePopup({
  setFilesData,
  pistonSupportedRuntimes,
  setIsAddingNewFile,
  fileName,
  setFileName,
  language,
  setLanguage,
  existingFileIndex,
}) {
  const [error, setError] = useState({ message: "", type: "" });
  const runCodeOption = useRef(true);

  const handleCreateFileClick = () => {
    if (fileName.trim() === "")
      return setError({ message: "File name cannot be empty", type: "error" });
    if (language.trim() === "")
      return setError({ message: "Language cannot be empty", type: "error" });

    const selectedLang = supportedLangs.find((lang) => lang.value === language);
    if (existingFileIndex.current !== -1) {
      console.log("Existing file index is", existingFileIndex.current);
      setFilesData((prevFilesData) => {
        const updatedFilesData = [...prevFilesData];
        updatedFilesData[existingFileIndex.current] = {
          ...updatedFilesData[existingFileIndex.current],
          fileName: `${fileName}.${selectedLang.extension}`,
          language: language,
        };
        return updatedFilesData;
      });
    } else {
      setFilesData((prevFilesData) => [
        ...prevFilesData,
        {
          fileName: `${fileName}.${selectedLang.extension}`,
          language,
          content: "",
          runCodeOption: runCodeOption.current,
        },
      ]);
    }
    setIsAddingNewFile(false);
    setFileName("");
    setLanguage("");
  };
  function findMatches(searchTerm) {
    const matches = [];

    // Iterate through the array of languages
    pistonSupportedRuntimes.forEach((item) => {
      // Check if the language or any of its aliases match the search term (case insensitive)
      if (
        item.language.toLowerCase() === searchTerm.toLowerCase() ||
        item.aliases.some(
          (alias) => alias.toLowerCase() === searchTerm.toLowerCase()
        )
      ) {
        // If there's a match, add the item to the result array
        matches.push(item);
      }
    });

    return matches;
  }

  const handleLanguageChange = (e) => {
    setError({ message: "", type: "" });
    const matches = findMatches(e.target.value);

    if (matches.length === 0) {
      setError({
        message:
          "Looks like the language you chose isn't supported by any runtimes. Feel free to create the file, but just a heads up—the Run Code feature won’t be available for this language.",
        type: "warning",
      });
      runCodeOption.current = false;
    }
    setLanguage(e.target.value);
  };
  return (
    <div className="w-full max-w-md p-4 mx-auto bg-white rounded-2xl shadow-input dark:bg-black/40">
      <div className="my-8">
        <div className="flex flex-col mb-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">File name</Label>
            <Input
              value={fileName}
              id="filename"
              placeholder="script"
              type="text"
              onChange={(e) => {
                setFileName(e.target.value);
              }}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            title="Language"
            onChange={handleLanguageChange}
            value={language}
            className="w-full text-sm px-3 py-[10px] rounded outline-none appearance-none cursor-pointer select-icon bg-[#272729]"
          >
            <option>Select Language</option>
            {supportedLangs.map((language, index) => (
              <option
                className="relative w-full "
                key={index}
                value={language.value}
              >
                {language.lang}
              </option>
            ))}
          </select>
        </LabelInputContainer>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setFileName("");
              setLanguage("");
              setIsAddingNewFile(false);
            }}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Close
            <BottomGradient />
          </button>
          <button
            onClick={handleCreateFileClick}
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-800 dark:to-zinc-800 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Create
            <BottomGradient />
          </button>
        </div>

        <p
          role="alert"
          className={`pt-2 text-[12px] text-center ${
            error.type === "warning" ? "text-orange-300" : "text-red-500"
          }`}
        >
          {error.message}
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
