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
  const [testCases, setTestCases] = useState<[string]>(['']);

  useEffect(() => {
    (async () => {
      const resolvedSocket = await socket;
      resolvedSocket?.on("initialData", (data: any) => {
        const { sessionData } = data;
        const { questionDescription, questionTestcases } = sessionData;
        setQuestion(questionDescription);
        setTestCases(questionTestcases);
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
      <Card className="flex flex-col h-full w-full p-4 gap-4 bg-gray-200 dark:bg-gray-800">
        <div className="flex flex-col w-full h-3/4">
          <h2 className="text-xl font-bold mb-4">Question:</h2>
          <Card className="flex flex-col w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{question}</ReactMarkdown>
        </Card>
        </div>
        <div className="flex flex-col w-full h-1/4">
          <h2 className="text-xl font-bold mb-4">Test Cases:</h2>
          <Card className="flex flex-col w-full h-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner overflow-y-auto">
            {testCases.map((testCase, index) => (
              <Card key={index} className="mb-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg shadow min-h-[35px]">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{testCase}</ReactMarkdown>
              </Card>
            ))}
          </Card>
        </div>
      </Card>
    </div>
  );
}
