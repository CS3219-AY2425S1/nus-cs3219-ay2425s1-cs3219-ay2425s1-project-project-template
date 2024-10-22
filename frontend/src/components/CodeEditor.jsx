import React from "react";

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const languages = ["Python", "JavaScript", "Java"];

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-4">CODE EDITOR</div>
      <div className="flex gap-2 mb-4">
        {languages.map((lang) => (
          <button
            key={lang}
            className={`px-4 py-1 rounded-full text-sm text-black transition-colors ${
              language === lang ? "bg-[#bcfe4d]" : "bg-[#DDDDDD] hover:bg-[#bcfe4d]"
            }`}
            onClick={() => setLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-[500px] bg-[#1e1e1e] text-white font-mono p-4 rounded resize-none focus:outline-none focus:ring-1 focus:ring-[#bcfe4d]"
          spellCheck="false"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="px-4 py-1 rounded-full text-sm text-black bg-[#DDDDDD] hover:bg-[#bcfe4d] transition-colors">
            Run
          </button>
          <button className="px-4 py-1 rounded-full text-sm text-black bg-[#bcfe4d] hover:bg-[#a6e636] transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}