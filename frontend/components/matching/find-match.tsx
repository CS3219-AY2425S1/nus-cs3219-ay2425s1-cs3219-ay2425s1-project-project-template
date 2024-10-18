"use client";
import React, { useState, useEffect } from "react";
import { MatchForm } from "@/components/matching/matching-form";
import { SearchProgress } from "@/components/matching/search-progress";
import { SelectionSummary } from "@/components/matching/selection-summary";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/app/auth/auth-context";
import { joinMatchQueue } from "@/lib/join-match-queue";

export default function FindMatch() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [waitTime, setWaitTime] = useState<number>(0);
  const [websocket, setWebsocket] = useState<WebSocket>();
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isSearching) {
      interval = setInterval(() => {
        setWaitTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setWaitTime(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  const handleSearch = async () => {
    if (!selectedDifficulty || !selectedTopic) {
      toast({
        title: "Invalid Selection",
        description: "Please select both a difficulty level and a topic",
        variant: "destructive",
      });
      return;
    }

    if (!auth || !auth.token) {
      toast({
        title: "Access denied",
        description: "No authentication token found",
        variant: "destructive",
      });
      return;
    }

    if (!auth.user) {
      toast({
        title: "Access denied",
        description: "Not logged in",
        variant: "destructive",
      });
      return;
    }

    const response = await joinMatchQueue(
      auth.token,
      auth?.user?.id,
      selectedTopic,
      selectedDifficulty
    );
    switch (response.status) {
      case 200:
        toast({
          title: "Matched",
          description: "Successfully matched",
          variant: "success",
        });
        return;
      case 202:
        setIsSearching(true);
        const ws = new WebSocket(
          `ws://localhost:6969/match/subscribe/${auth?.user?.id}/${selectedTopic}/${selectedDifficulty}`
        );
        ws.onmessage = () => {
          setIsSearching(false);
          toast({
            title: "Matched",
            description: "Successfully matched",
            variant: "success",
          });
        };
        setWebsocket(ws);
        return;
      default:
        toast({
          title: "Unknown Error",
          description: "An unexpected error has occured",
          variant: "destructive",
        });
        return;
    }
  };

  const handleCancel = () => {
    setIsSearching(false);
    setWaitTime(0);
  };

  return (
    <div className="container mx-auto p-4">
      <MatchForm
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        handleSearch={handleSearch}
        isSearching={isSearching}
        handleCancel={handleCancel}
      />

      {isSearching && <SearchProgress waitTime={waitTime} />}

      {!isSearching && (selectedDifficulty || selectedTopic) && (
        <SelectionSummary
          selectedDifficulty={selectedDifficulty}
          selectedTopic={selectedTopic}
        />
      )}
    </div>
  );
}
