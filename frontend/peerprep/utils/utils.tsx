export function capitalize(word: string) {
  if (typeof word !== "string" || word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const languages = [
  "TYPESCRIPT",
  "JAVASCRIPT",
  "CSS",
  "LESS",
  "SCSS",
  "JSON",
  "HTML",
  "XML",
  "PHP",
  "CSHARP",
  "CPP",
  "RAZOR",
  "MARKDOWN",
  "DIFF",
  "JAVA",
  "VB",
  "COFFEESCRIPT",
  "HANDLEBARS",
  "BATCH",
  "PUG",
  "FSHARP",
  "LUA",
  "POWERSHELL",
  "PYTHON",
  "RUBY",
  "SASS",
  "R",
  "OBJECTIVE-C",
];
