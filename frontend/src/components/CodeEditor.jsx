import React, { useState } from "react";

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const languages = ["Python", "JavaScript", "Java"];

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const renderLineNumbers = () => {
    const lines = code.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  };

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-2">CODE EDITOR</div>
      <div className="bg-[#1e1e1e] p-4 rounded">
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
        <div className="relative flex bg-gray-100/10" >
          <div className="text-[#888] bg-gray-100/10 text-right p-2 pt-4">
            <pre>{renderLineNumbers()}</pre>
          </div>
          <textarea
            value={code}
            onChange={handleInputChange}
            className="w-full h-[500px] bg-gray-100/10 text-white p-4 rounded resize-none focus:outline-none focus:ring-0 focus:ring-none"
            spellCheck="false"
            placeholder="Write your code here..."
          />
        </div>
        <div className="flex justify-end mt-4 gap-2">
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
