import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "./chat";
import CodeEditor from "./code-editor";
import QuestionDisplay from "./question-display";

export default function CollabRoom({ roomId }: { roomId: string }) {
  return (
    <div className="h-full flex flex-col mx-4 p-4">
      <header className="flex justify-between border-b">
        <h1 className="text-2xl font-bold mb-4">Collab Room {roomId}</h1>
        <Button variant="destructive">
          Leave Room
          <X className="ml-2" />
        </Button>
      </header>
      <div className="flex flex-1">
        <div className="w-2/5 p-4 flex flex-col space-y-4">
          <QuestionDisplay />
          <Chat roomId={roomId} />
        </div>
        <CodeEditor />
      </div>
    </div>
  );
}
