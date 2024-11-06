"use client";

import { useEffect, useRef, useState } from 'react';
import { Copy, Flag, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner"
import { useSearchParams } from 'next/navigation';
import { getCookie, setCookie } from '@/app/utils/cookie-manager';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import Editor from "@monaco-editor/react";
import { toast } from "sonner"

type Question = {
    id: number;
    title: string;
    complexity: string;
    category: string[];
    description: string;
    link: string;
}

function getTimeAgo(attemptDate: Date | null) {
    const now = new Date();

    const diffInMs = now - attemptDate; // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
        return "1 minute ago";
    }
}
  
export default function CodeViewer() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("questionId");
  const [attemptDate, setAttemptDate] = useState<Date | null>(null);
  const [questionDetails, setQuestionDetails] = useState<Question>({
      "id": 1,
      "title": "Question Title",
      "complexity": "Easy",
      "category": ["Arrays", "Algorithms"],
      "description": "question details",
      "link": ""
  });
  const [code, setCode] = useState("");
  const userId = useRef<string | null>(null);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        userId.current = getCookie('userId');

        if (!userId.current) {
            // Call the API to get user id
            const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API_AUTH_URL}/verify-token`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${getCookie('token')}`,
              },
            }); 
  
            const data = (await response.json()).data;
            setCookie('userId', data.id, { 'max-age': '86400', 'path': '/', 'SameSite': 'Strict' });
        }

        console.log("In question history page: call api to fetch user past atttempted code")
        const response = await fetch(`${process.env.NEXT_PUBLIC_USER_API_HISTORY_URL}/${userId.current}/question/${questionId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('token')}`,
            },
          }
        );
        
        const data = await response.json();
        if (!response.ok) {
            console.error("Error:", data.message);
            throw Error("Error happen when calling backend API");
        }

        setQuestionDetails({
            id: data.question.id,
            title: data.question.title,
            complexity:  data.question.complexity,
            category: data.question.category.sort((a: string, b: string) =>
                a.localeCompare(b)
            ),
            description: data.question.description,
            link: data.question.link,
        })
        setAttemptDate(new Date(data.attemptDate));
        setCode(JSON.parse(`"${data.code}"`))
      } catch (err) {
        console.error(err.message);
        toast.dismiss();
        toast.error("Failed to load the code. Please try again later.");
      }
    };

    fetchAttemptDetails();
  }, [questionId]);

  const handleEditorDidMount = (editor) => {
    editor.getDomNode().classList.add("my-custom-editor");

    // Insert scoped tooltip styles
    const style = document.createElement("style");
    style.textContent = `
        .my-custom-editor .monaco-tooltip {
            z-index: 1000 !important;
            position: absolute;
        }
    `;
    document.head.appendChild(style);

    // Cleanup on component unmount
    return () => {
        document.head.removeChild(style);
    };
};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
        toast.dismiss();
        toast.success('Code copied to clipboard!');
    });
  };

  return (
    <div className="flex gap-4 min-h-screen px-10 pt-24 pb-5">
        {/* Left Panel: Question Details */}
        <ScrollArea className="w-1/2 p-4 border rounded-lg shadow bg-white">
            <h3 className="text-3xl font-serif font-large tracking-tight">
                {questionDetails?.title || ""}
            </h3>
            <div className="flex items-center gap-10 mt-8">
                <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-icon" />
                    <Badge
                        variant={
                            (questionDetails?.complexity || "").toLowerCase() as BadgeProps["variant"]
                        }
                    >
                        {questionDetails?.complexity || ""}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-icon" />
                    {questionDetails?.category?.length > 0 &&
                     questionDetails?.category.map((category) => (
                        <Badge
                            key={category}
                            variant="category"
                            className="uppercase text-category-text bg-category-bg"
                        >
                            {category}
                        </Badge>
                    ))}
                </div>
            </div>
            <p className="mt-8 text-l text-foreground">
                {questionDetails?.description || ""}
            </p>
        </ScrollArea>

        {/* Right Panel: Code Display */}
        <div className="w-1/2 flex flex-col border rounded-lg shadow bg-gray-50">
            <div className="flex justify-between items-center bg-gray-100 px-5 py-1 border-b">
                <div className="text-gray-500 text-sm">
                    {code.split('\n').length} lines {attemptDate ? ` • Attempted ${getTimeAgo(attemptDate)}` : ""}
                </div>
                <Button onClick={copyToClipboard} className='flex items-center gap-1 bg-gray-100 border border-gray-300 rounded text-gray-700 hover:bg-gray-200 hover:border-gray-400'>
                    <Copy className="h-4 w-4" /> Copy
                </Button>
            </div>

            {/* Editor Wrapper */}
            <div className="flex-grow">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        lineNumbers: "on",
                        fontSize: 14,
                        padding: { top: 10, bottom: 10 },
                        scrollBeyondLastLine: false,
                        scrollbar: {
                            vertical: "hidden",
                            horizontal: "auto",
                        },
                    }}
                />
            </div>
        </div>

        <Toaster position="top-center" />
    </div>
  );
}
