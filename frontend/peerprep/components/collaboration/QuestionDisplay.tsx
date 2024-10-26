"use client"

import { useRef, useState, useEffect } from "react";
import { socket } from "../../services/sessionSocketService";
import { useTheme } from "next-themes";
import { Card } from '@nextui-org/react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function QuestionDisplay() {
  const { theme } = useTheme();
  const [question, setQuestion] = useState<string>("Question Loading...");

  useEffect(() => {
    (async () => {
      const resolvedSocket = await socket;
      resolvedSocket?.on("initialData", (data: any) => {
        const { sessionData } = data;
        const { questionDescription, questionTestcases } = sessionData;
        setQuestion(questionDescription);
        console.log("questionDesciption: ", questionDescription);
      });
    })();

    return () => {
      (async () => {
        const resolvedSocket = await socket;
        resolvedSocket?.off("initialData");
      })();
    };
  }, []);


  return (
    <div className="flex justify-center items-center h-full w-full">
      <Card className="flex flex-row h-full w-full p-4 gap-4 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col w-3/4 h-full">
          <h2 className="text-xl font-bold mb-4">Question:</h2>
          <Card className="flex flex-col w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{question}</ReactMarkdown>
        </Card>
        </div>
        <div className="flex flex-col w-1/4 h-full">
          <h2 className="text-xl font-bold mb-4">Test Cases:</h2>
          <Card className="flex flex-col w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner">
            
          </Card>
        </div>
      </Card>
    </div>
  );
}
