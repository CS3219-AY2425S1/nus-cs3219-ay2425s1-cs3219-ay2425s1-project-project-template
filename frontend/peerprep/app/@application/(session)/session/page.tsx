"use client";
import { CollabNavbar } from "@/components/collaboration/CollabNavbar";

import QuestionDisplay from "@/components/collaboration/QuestionDisplay";

import * as Y from "yjs";
import { use, useEffect, useState } from "react";
import { SupportedLanguages } from "@/utils/utils";
import {
  disconnectSocket,
  initializeSessionSocket,
  propagateCodeOutput,
  propagateDocUpdate,
  propagateLanguage,
} from "@/services/sessionService";
import CollabCodeEditor from "../../../../components/collaboration/CollabCodeEditor";
import { codeOutputInterface } from "@/components/collaboration/Output";

const App: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguages>("javascript");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [questionTestcases, setQuestionTestcases] = useState<string[]>([]);
  const [codeOutput, setCodeOutput] = useState<string[] | null>(null);
  const [isCodeError, setIsCodeError] = useState<boolean>(false);

  const doc = new Y.Doc();
  const yText = doc.getText("code");
  const updateDoc = async (update: Uint8Array) => {
    Y.applyUpdate(doc, update);
  };

  function propagateUpdates(
    docUpdate?: Uint8Array,
    languageUpdate?: SupportedLanguages,
    codeOutput?: codeOutputInterface
  ) {
    if (docUpdate) {
      updateDoc(docUpdate);
      propagateDocUpdate(docUpdate);
    }

    if (languageUpdate) {
      setLanguage(languageUpdate);
      propagateLanguage(languageUpdate);
    }

    if (codeOutput) {
      handleCodeUpdate(codeOutput);
      propagateCodeOutput(codeOutput);
    }
  }

  function handleCodeUpdate(codeOutput: codeOutputInterface) {
    if (codeOutput.stderr) {
      setCodeOutput(codeOutput.stderr.split("\n"));
      setIsCodeError(true);
    } else {
      setCodeOutput(codeOutput.stdout.split("\n"));
      setIsCodeError(false);
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

    return () => {
      disconnectSocket();
    };
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
            codeOutput={codeOutput}
            isCodeError={isCodeError}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
