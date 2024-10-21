import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../../context/SettingsContext";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
function Settings({ socketRef, pistonSupportedRuntimes }) {
  const supportedLangs = [
    { lang: "JavaScript", value: "javascript", intellisense: true },
    { lang: "TypeScript", value: "typescript", intellisense: true },
    { lang: "HTML", value: "html", intellisense: true },
    { lang: "JSON", value: "json", intellisense: true },
    { lang: "SCSS", value: "scss", intellisense: true },
    { lang: "CSS", value: "css", intellisense: true },
    { lang: "LESS", value: "less", intellisense: true },
    { lang: "Java", value: "java", intellisense: false },
    { lang: "Kotlin", value: "kotlin", intellisense: false },
    { lang: "Python", value: "python", intellisense: false },
    { lang: "C++", value: "cpp", intellisense: false },
    { lang: "Dart", value: "dart", intellisense: false },
    { lang: "Dockerfile", value: "dockerfile", intellisense: false },
    { lang: "C#", value: "csharp", intellisense: false },
    { lang: "PHP", value: "php", intellisense: false },
    { lang: "Rust", value: "rust", intellisense: false },
    { lang: "Shell", value: "shell", intellisense: false },
    { lang: "Solidity", value: "solidity", intellisense: false },
    { lang: "SQL", value: "sql", intellisense: false },
    { lang: "Swift", value: "swift", intellisense: false },
    { lang: "XML", value: "xml", intellisense: false },
    { lang: "YAML", value: "yaml", intellisense: false },
    { lang: "GraphQL", value: "graphql", intellisense: false },
    { lang: "ABAP", value: "abap", intellisense: false },
    { lang: "Apex", value: "apex", intellisense: false },
    { lang: "AZCLI", value: "azcli", intellisense: false },
    { lang: "Batch", value: "bat", intellisense: false },
    { lang: "Bicep", value: "bicep", intellisense: false },
    { lang: "Camligo", value: "cameligo", intellisense: false },
    { lang: "Clojure", value: "clojure", intellisense: false },
    { lang: "CoffeeScript", value: "coffee", intellisense: false },
    { lang: "CSP", value: "csp", intellisense: false },
    { lang: "Cypher", value: "cypher", intellisense: false },
    { lang: "ECL", value: "ecl", intellisense: false },
    { lang: "Elixir", value: "elixir", intellisense: false },
    { lang: "Flow9", value: "flow9", intellisense: false },
    { lang: "Freemarker2", value: "freemarker2", intellisense: false },
    { lang: "F#", value: "fsharp", intellisense: false },
    { lang: "Go", value: "go", intellisense: false },
    { lang: "Handlebars", value: "handlebars", intellisense: false },
    { lang: "HCL", value: "hcl", intellisense: false },
    { lang: "INI", value: "ini", intellisense: false },
    { lang: "Julia", value: "julia", intellisense: false },
    { lang: "Lexon", value: "lexon", intellisense: false },
    { lang: "Liquid", value: "liquid", intellisense: false },
    { lang: "Lua", value: "lua", intellisense: false },
    { lang: "M3", value: "m3", intellisense: false },
    { lang: "Markdown", value: "markdown", intellisense: false },
    { lang: "MDX", value: "mdx", intellisense: false },
    { lang: "MIPS", value: "mips", intellisense: false },
    { lang: "MSDAX", value: "msdax", intellisense: false },
    { lang: "MySQL", value: "mysql", intellisense: false },
    { lang: "Objective-C", value: "objective-c", intellisense: false },
    { lang: "Pascal", value: "pascal", intellisense: false },
    { lang: "Pascaligo", value: "pascaligo", intellisense: false },
    { lang: "Perl", value: "perl", intellisense: false },
    { lang: "PostgreSQL", value: "pgsql", intellisense: false },
    { lang: "PLA", value: "pla", intellisense: false },
    { lang: "Powershell", value: "powershell", intellisense: false },
    { lang: "Pug", value: "pug", intellisense: false },
    { lang: "Q#", value: "qsharp", intellisense: false },
    { lang: "R", value: "r", intellisense: false },
    { lang: "Razor", value: "razor", intellisense: false },
    { lang: "Redis", value: "redis", intellisense: false },
    { lang: "Redshift", value: "redshift", intellisense: false },
    {
      lang: "reStructuredText",
      value: "restructuredtext",
      intellisense: false,
    },
    { lang: "Ruby", value: "ruby", intellisense: false },
    { lang: "SB", value: "sb", intellisense: false },
    { lang: "Scala", value: "scala", intellisense: false },
    { lang: "Scheme", value: "scheme", intellisense: false },
    { lang: "Sophia", value: "sophia", intellisense: false },
    { lang: "SPARQL", value: "sparql", intellisense: false },
    { lang: "ST", value: "st", intellisense: false },
    { lang: "SystemVerilog", value: "systemverilog", intellisense: false },
    { lang: "Tcl", value: "tcl", intellisense: false },
    { lang: "Test", value: "test", intellisense: false },
    { lang: "Twig", value: "twig", intellisense: false },
    { lang: "TypeSpec", value: "typespec", intellisense: false },
    { lang: "VB", value: "vb", intellisense: false },
    { lang: "WGSL", value: "wgsl", intellisense: false },
  ];

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
