export function capitalize(word: string) {
  if (typeof word !== "string" || word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export type SupportedLanguages = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const languages = [
  "typescript",
  "javascript",
  "css",
  "less",
  "scss",
  "json",
  "html",
  "xml",
  "php",
  "csharp",
  "cpp",
  "razor",
  "markdown",
  "diff",
  "java",
  "vb",
  "coffeescript",
  "handlebars",
  "batch",
  "pug",
  "fsharp",
  "lua",
  "powershell",
  "python",
  "ruby",
  "sass",
  "r",
  "objective-c",
];

