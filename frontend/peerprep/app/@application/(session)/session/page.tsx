"use client";
import { CollabNavbar } from "@/components/collaboration/CollabNavbar";

import QuestionDisplay from "@/components/collaboration/QuestionDisplay";

import * as Y from "yjs";
import { use, useEffect, useState } from "react";
import { SupportedLanguages } from "@/utils/utils";
import { initializeSessionSocket } from "@/services/sessionService";
import CollabCodeEditor from "../../../../components/collaboration/CollabCodeEditor";

const App: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [questionTestcases, setQuestionTestcases] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string>("");

  const doc = new Y.Doc();
  const yText = doc.getText("code");
  const updateDoc = async (update: Uint8Array) => {
    Y.applyUpdate(doc, update);
  };

  async function propagateUpdates(
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: string
  ) {
    if (docUpdate) {
      updateDoc(docUpdate);
    }

    if (languageUpdate) {
      setLanguage(languageUpdate);
    }

    if (codeOutput) {
      console.log("Code output:", codeOutput);
    }
  }

  useEffect(() => {
    initializeSessionSocket(
      setLanguage,
      setUsersInRoom,
      setQuestionDescription,
      setQuestionTestcases,
      updateDoc
    );
  }, []);

  return (
    <div className="relative flex flex-col h-screen">
      <CollabNavbar usersInRoom={usersInRoom} setUsersInRoom={setUsersInRoom} />
      <div className="flex flex-row w-full h-[90vh] gap-2">
        <div className="flex w-1/2 h-full">
          <QuestionDisplay />
        </div>
        <div className="flex w-1/2 h-full">
          <CollabCodeEditor
            language={language}
            yDoc={doc}
            propagateUpdates={propagateUpdates}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
