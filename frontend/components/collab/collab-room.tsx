import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Chat from "./chat";
import CodeEditor from "./code-editor";

export default function CollabRoom({ roomId }: { roomId: String }) {
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
        <Chat />
        <CodeEditor />
      </div>
    </div>
  );
}
