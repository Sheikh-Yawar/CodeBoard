import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import supportedLangs from "../data/supportedLanguages";
function Settings({ socketRef, pistonSupportedRuntimes }) {
  const supportedThemes = [
    { theme: "VS-Light", value: "vs" },
    { theme: "VS-Dark", value: "vs-dark" },
    { theme: "High Contrast - Light", value: "hc-light" },
    { theme: "High Contrast - Black", value: "hc-black" },
  ];

  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");
  const settingsContext = useContext(SettingsContext);

  useEffect(() => {
    setLanguage(settingsContext.settings.language);
    setTheme(settingsContext.settings.theme);
  }, [settingsContext, pistonSupportedRuntimes]);

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
    const matches = findMatches(e.target.value);
    if (matches.length === 0) {
      toast.error(
        "The language you have selected is not supported by any runtimes that we currently have. Please select a different language."
      );
    }
    setLanguage(e.target.value);
    settingsContext.updateSettings("language", e.target.value);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId: settingsContext.settings.roomId,
      username: settingsContext.settings.userName,
      language: e.target.value,
    });
  };
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    settingsContext.updateSettings("theme", e.target.value);
  };

  return (
    <div className="flex flex-col w-full gap-4 p-2">
      <div>
        <p className="text-[24px] pb-1">Themes</p>
        <select
          title="Themes"
          value={theme}
          onChange={handleThemeChange}
          className="select-icon appearance-none text-[20px] rounded px-3 py-2 w-full bg-secondary outline-none cursor-pointer  "
        >
          {supportedThemes.map((theme, index) => (
            <option
              className="w-full hover:bg-primary"
              key={index}
              value={theme.value}
            >
              {theme.theme}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-[24px] pb-1">Languages</p>
        <select
          title="Languages"
          onChange={handleLanguageChange}
          value={language}
          className="w-full px-3 py-2 rounded outline-none appearance-none cursor-pointer select-icon text-[20px] bg-secondary"
        >
          {supportedLangs.map((language, index) => (
            <option
              className="relative w-full "
              key={index}
              value={language.value}
            >
              {language.lang}
              {/* {language.intellisense && (
                <div className="absolute text-xs bg-red-300">
                  Intellisense Support
                </div>
              )} */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Settings;
