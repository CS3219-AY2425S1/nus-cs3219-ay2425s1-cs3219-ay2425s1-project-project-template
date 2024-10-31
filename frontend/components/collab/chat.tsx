"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function Chat() {
  const [chatTarget, setChatTarget] = useState<string>("partner");
  const [newMessage, setNewMessage] = useState<string>("");
  const [partnerMessages, setPartnerMessages] = useState<string[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (partnerMessages.length > 0 || aiMessages.length > 0) {
      scrollToBottom();
    }
  }, [partnerMessages, aiMessages]);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      if (chatTarget === "partner") {
        setPartnerMessages([...partnerMessages, newMessage]);
      } else {
        setAiMessages([...aiMessages, newMessage]);
      }
      setNewMessage("");
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs
          value={chatTarget}
          onValueChange={setChatTarget}
          className="flex-col"
        >
          <TabsList className="flex-shrink-0 mb-2">
            <TabsTrigger value="partner">Partner Chat</TabsTrigger>
            <TabsTrigger value="ai">AI Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="partner" className="h-full">
            <ScrollArea className="h-[calc(70vh-280px)]">
              <div className="pr-4 space-y-2">
                {partnerMessages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
                <div ref={lastMessageRef} />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ai" className="h-full">
            <ScrollArea className="h-[calc(70vh-280px)]">
              <div className="pr-4 space-y-2">
                {aiMessages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
                <div ref={lastMessageRef} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="flex space-x-2 mt-4 pt-4 border-t">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${chatTarget === "partner" ? "your partner" : "AI assistant"}...`}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
