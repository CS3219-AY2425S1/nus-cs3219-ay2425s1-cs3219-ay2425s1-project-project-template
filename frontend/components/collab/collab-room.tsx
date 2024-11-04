import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "./chat";
import QuestionDisplay from "./question-display";
import CodeEditor from "./code-editor";
import Link from "next/link";

export default function CollabRoom({ roomId }: { roomId: string }) {
  return (
    <div className="h-full flex flex-col mx-4 p-4">
      <header className="flex justify-between border-b">
        <h1 className="text-2xl font-bold mb-4">Collab Room {roomId}</h1>
        <Link href="/app/history">
          <Button variant="destructive">
            Leave Room
            <X className="ml-2" />
          </Button>
        </Link>
      </header>
      <div className="flex flex-1">
        <div className="w-2/5 p-4 flex flex-col space-y-4">
          <QuestionDisplay roomId={roomId} />
          <Chat roomId={roomId} />
        </div>
        <CodeEditor roomId={roomId} />
      </div>
    </div>
  );
}
