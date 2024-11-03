"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSessionContext } from "@/contexts/SessionContext";
import ChatBottomToolbar from "./ChatBottomToolbar";
import ChatTopToolbar from "./ChatTopToolbar";
import ChatBubbles from "./ChatBubbles";

export default function Chatbox() {
  const { messages } = useSessionContext();

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // if (newMessage.trim()) {
    //   setMessages([
    //     { id: messages.length + 1, sender: "You", content: newMessage },
    //     ...messages,
    //   ]);
    //   setNewMessage("");
    // }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        "relative flex h-full overflow-hidden",
        isCollapsed ? "w-20" : "w-96"
      )}
    >
      <div className="absolute top-0 left-0 flex flex-col h-full w-96">
        <ChatTopToolbar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <ChatBubbles isCollapsed={isCollapsed} messages={messages} />
        <ChatBottomToolbar isCollapsed={isCollapsed} />
      </div>
    </Card>
  );
}
