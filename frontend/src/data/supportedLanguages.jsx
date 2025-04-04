const supportedLangs = [
  {
    lang: "JavaScript",
    value: "javascript",
    intellisense: true,
    extension: "js",
  },
  {
    lang: "TypeScript",
    value: "typescript",
    intellisense: true,
    extension: "ts",
  },
  { lang: "HTML", value: "html", intellisense: true, extension: "html" },
  { lang: "JSON", value: "json", intellisense: true, extension: "json" },
  { lang: "SCSS", value: "scss", intellisense: true, extension: "scss" },
  { lang: "CSS", value: "css", intellisense: true, extension: "css" },
  { lang: "LESS", value: "less", intellisense: true, extension: "less" },
  { lang: "Java", value: "java", intellisense: false, extension: "java" },
  { lang: "Kotlin", value: "kotlin", intellisense: false, extension: "kt" },
  { lang: "Python", value: "python", intellisense: false, extension: "py" },
  { lang: "C++", value: "cpp", intellisense: false, extension: "cpp" },
  { lang: "Dart", value: "dart", intellisense: false, extension: "dart" },
  {
    lang: "Dockerfile",
    value: "dockerfile",
    intellisense: false,
    extension: "dockerfile",
  },
  { lang: "C#", value: "csharp", intellisense: false, extension: "cs" },
  { lang: "PHP", value: "php", intellisense: false, extension: "php" },
  { lang: "Rust", value: "rust", intellisense: false, extension: "rs" },
  { lang: "Shell", value: "shell", intellisense: false, extension: "sh" },
  {
    lang: "Solidity",
    value: "solidity",
    intellisense: false,
    extension: "sol",
  },
  { lang: "SQL", value: "sql", intellisense: false, extension: "sql" },
  { lang: "Swift", value: "swift", intellisense: false, extension: "swift" },
  { lang: "XML", value: "xml", intellisense: false, extension: "xml" },
  { lang: "YAML", value: "yaml", intellisense: false, extension: "yaml" },
  {
    lang: "GraphQL",
    value: "graphql",
    intellisense: false,
    extension: "graphql",
  },
  { lang: "ABAP", value: "abap", intellisense: false, extension: "abap" },
  { lang: "Apex", value: "apex", intellisense: false, extension: "cls" },
  { lang: "AZCLI", value: "azcli", intellisense: false, extension: "azcli" },
  { lang: "Batch", value: "bat", intellisense: false, extension: "bat" },
  { lang: "Bicep", value: "bicep", intellisense: false, extension: "bicep" },
  {
    lang: "Camligo",
    value: "cameligo",
    intellisense: false,
    extension: "mligo",
  },
  { lang: "Clojure", value: "clojure", intellisense: false, extension: "clj" },
  {
    lang: "CoffeeScript",
    value: "coffee",
    intellisense: false,
    extension: "coffee",
  },
  { lang: "CSP", value: "csp", intellisense: false, extension: "csp" },
  { lang: "Cypher", value: "cypher", intellisense: false, extension: "cql" },
  { lang: "ECL", value: "ecl", intellisense: false, extension: "ecl" },
  { lang: "Elixir", value: "elixir", intellisense: false, extension: "ex" },
  { lang: "Flow9", value: "flow9", intellisense: false, extension: "flow" },
  {
    lang: "Freemarker2",
    value: "freemarker2",
    intellisense: false,
    extension: "ftl",
  },
  { lang: "F#", value: "fsharp", intellisense: false, extension: "fs" },
  { lang: "Go", value: "go", intellisense: false, extension: "go" },
  {
    lang: "Handlebars",
    value: "handlebars",
    intellisense: false,
    extension: "hbs",
  },
  { lang: "HCL", value: "hcl", intellisense: false, extension: "hcl" },
  { lang: "INI", value: "ini", intellisense: false, extension: "ini" },
  { lang: "Julia", value: "julia", intellisense: false, extension: "jl" },
  { lang: "Lexon", value: "lexon", intellisense: false, extension: "lex" },
  { lang: "Liquid", value: "liquid", intellisense: false, extension: "liquid" },
  { lang: "Lua", value: "lua", intellisense: false, extension: "lua" },
  { lang: "M3", value: "m3", intellisense: false, extension: "m3" },
  { lang: "Markdown", value: "markdown", intellisense: false, extension: "md" },
  { lang: "MDX", value: "mdx", intellisense: false, extension: "mdx" },
  { lang: "MIPS", value: "mips", intellisense: false, extension: "s" },
  { lang: "MSDAX", value: "msdax", intellisense: false, extension: "msdax" },
  { lang: "MySQL", value: "mysql", intellisense: false, extension: "sql" },
  {
    lang: "Objective-C",
    value: "objective-c",
    intellisense: false,
    extension: "m",
  },
  { lang: "Pascal", value: "pascal", intellisense: false, extension: "pas" },
  {
    lang: "Pascaligo",
    value: "pascaligo",
    intellisense: false,
    extension: "ligo",
  },
  { lang: "Perl", value: "perl", intellisense: false, extension: "pl" },
  { lang: "PostgreSQL", value: "pgsql", intellisense: false, extension: "sql" },
  { lang: "PLA", value: "pla", intellisense: false, extension: "pla" },
  {
    lang: "Powershell",
    value: "powershell",
    intellisense: false,
    extension: "ps1",
  },
  { lang: "Pug", value: "pug", intellisense: false, extension: "pug" },
  { lang: "Q#", value: "qsharp", intellisense: false, extension: "qs" },
  { lang: "R", value: "r", intellisense: false, extension: "r" },
  { lang: "Razor", value: "razor", intellisense: false, extension: "cshtml" },
  { lang: "Redis", value: "redis", intellisense: false, extension: "redis" },
  {
    lang: "Redshift",
    value: "redshift",
    intellisense: false,
    extension: "sql",
  },
  {
    lang: "reStructuredText",
    value: "restructuredtext",
    intellisense: false,
    extension: "rst",
  },
  { lang: "Ruby", value: "ruby", intellisense: false, extension: "rb" },
  { lang: "SB", value: "sb", intellisense: false, extension: "sb" },
  { lang: "Scala", value: "scala", intellisense: false, extension: "scala" },
  { lang: "Scheme", value: "scheme", intellisense: false, extension: "scm" },
  { lang: "Sophia", value: "sophia", intellisense: false, extension: "aes" },
  { lang: "SPARQL", value: "sparql", intellisense: false, extension: "rq" },
  { lang: "ST", value: "st", intellisense: false, extension: "st" },
  {
    lang: "SystemVerilog",
    value: "systemverilog",
    intellisense: false,
    extension: "sv",
  },
  { lang: "Tcl", value: "tcl", intellisense: false, extension: "tcl" },
  { lang: "Test", value: "test", intellisense: false, extension: "test" },
  { lang: "Twig", value: "twig", intellisense: false, extension: "twig" },
  {
    lang: "TypeSpec",
    value: "typespec",
    intellisense: false,
    extension: "cadl",
  },
  { lang: "VB", value: "vb", intellisense: false, extension: "vb" },
  { lang: "Verilog", value: "verilog", intellisense: false, extension: "v" },
  { lang: "VHDL", value: "vhdl", intellisense: false, extension: "vhdl" },
  { lang: "VUE", value: "vue", intellisense: false, extension: "vue" },
  { lang: "XQuery", value: "xquery", intellisense: false, extension: "xq" },
  { lang: "Zi", value: "zig", intellisense: false, extension: "zig" },
  { lang: "WGSL", value: "wgsl", intellisense: false, extension: "wgsl" },
];

export default supportedLangs;
