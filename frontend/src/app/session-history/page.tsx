'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SessionHistoryViewer = ({ sessionId }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // This would come from your backend - example data structure
  const sessionData = {
    id: "session-123",
    questions: [
      {
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target...",
        topic: "Arrays",
        difficulty: "Easy",
        attempts: [
          {
            id: 1,
            user: {
              name: "Isabella",
              avatar: "/placeholder-user.jpg",
              initials: "IN"
            },
            timestamp: "10 minutes ago",
            language: "Python",
            code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
            testCasesPassed: 3,
            totalTestCases: 3,
            runtime: "56ms",
            memory: "16.4 MB"
          }
        ]
      },
      {
        id: 2,
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid...",
        topic: "Strings",
        difficulty: "Easy",
        attempts: [
          {
            id: 2,
            user: {
              name: "Olivia",
              avatar: "/placeholder-user.jpg",
              initials: "AC"
            },
            timestamp: "15 minutes ago",
            language: "JavaScript",
            code: `function isValid(s) {
    const stack = [];
    const pairs = {
        '(': ')',
        '{': '}',
        '[': ']'
    };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            if (pairs[stack.pop()] !== char) return false;
        }
    }
    
    return stack.length === 0;
}`,
            testCasesPassed: 2,
            totalTestCases: 3,
            runtime: "62ms",
            memory: "42.5 MB"
          }
        ]
      }
    ]
  };

  const QuestionList = () => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Session Questions</CardTitle>
        <CardDescription>Click on a question to view attempts</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="px-4 pb-4 space-y-2">
          {sessionData.questions.map((question) => (
            <Button
              key={question.id}
              variant={selectedQuestion?.id === question.id ? "default" : "outline"}
              className="w-full justify-start h-auto p-4"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="text-left space-y-1">
                <div className="font-semibold">{question.title}</div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {question.topic}
                  </span>
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {question.difficulty}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {question.attempts.length} attempts
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );

  const QuestionDetails = () => {
    if (!selectedQuestion) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent>
            <p className="text-muted-foreground">Select a question to view details</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{selectedQuestion.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                  {selectedQuestion.topic}
                </span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
                  {selectedQuestion.difficulty}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {selectedQuestion.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  const AttemptsView = () => {
    if (!selectedQuestion) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent>
            <p className="text-muted-foreground">Select a question to view attempts</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Question Attempts</CardTitle>
          <CardDescription>
            {selectedQuestion.attempts.length} attempts for this question
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-[calc(100vh-15rem)]">
          <CardContent>
            <div className="space-y-6">
              {selectedQuestion.attempts.map((attempt) => (
                <div key={attempt.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={attempt.user.avatar} />
                        <AvatarFallback>{attempt.user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{attempt.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {attempt.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {attempt.language}
                      </div>
                      <div className={`text-sm ${
                        attempt.testCasesPassed === attempt.totalTestCases 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`}>
                        {attempt.testCasesPassed}/{attempt.totalTestCases} tests passed
                      </div>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                        <code>{attempt.code}</code>
                      </pre>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CardDescription>Runtime:</CardDescription>
                          {attempt.runtime}
                        </div>
                        <div className="flex items-center gap-2">
                          <CardDescription>Memory:</CardDescription>
                          {attempt.memory}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  };

  return (
    <div className="h-screen p-6">
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-6rem)]">
        <div className="space-y-4 h-full">
          {!selectedQuestion ? <QuestionList /> : <QuestionDetails />}
          {selectedQuestion && (
            <Button 
              variant="outline" 
              onClick={() => setSelectedQuestion(null)}
              className="w-full"
            >
              Back to Question List
            </Button>
          )}
        </div>
        <AttemptsView />
      </div>
    </div>
  );
};

export default SessionHistoryViewer;