"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const difficulties: string[] = ["Easy", "Medium", "Hard"];
const topics: string[] = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
];

export default function MatchingForm() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [waitTime, setWaitTime] = useState<number>(0);

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

  const handleSearch = () => {
    if (selectedDifficulty && selectedTopic) {
      setIsSearching(true);
    } else {
      alert("Please select both a difficulty level and a topic");
    }
  };

  const handleCancel = () => {
    setIsSearching(false);
    setWaitTime(0);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Find a Match</CardTitle>
          <CardDescription>
            Select your preferred difficulty level and topic to find a match.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label
                htmlFor="difficulty-select"
                className="text-lg font-medium mb-2 block"
              >
                Difficulty Level
              </Label>
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger id="difficulty-select">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="topic-select"
                className="text-lg font-medium mb-2 block"
              >
                Topic
              </Label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger id="topic-select">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isSearching ? (
            <Button onClick={handleSearch}>Find Match</Button>
          ) : (
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Search
            </Button>
          )}
        </CardFooter>
      </Card>

      {isSearching && (
        <Card className="w-full max-w-2xl mx-auto mt-4">
          <CardHeader>
            <CardTitle>Searching for Match</CardTitle>
            <CardDescription>
              Please wait while we find a suitable match for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress
                value={(waitTime % 60) * (100 / 60)}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Wait Time: {Math.floor(waitTime / 60)}:
                    {(waitTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <span>Searching...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isSearching && (selectedDifficulty || selectedTopic) && (
        <Alert className="w-full max-w-2xl mx-auto mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Selection Summary</AlertTitle>
          <AlertDescription>
            <p>Difficulty: {selectedDifficulty || "None selected"}</p>
            <p>Topic: {selectedTopic || "None selected"}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
