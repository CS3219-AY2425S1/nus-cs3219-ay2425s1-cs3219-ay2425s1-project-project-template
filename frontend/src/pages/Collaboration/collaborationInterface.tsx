import React, { useState, ChangeEvent, FC } from 'react';
import { ExternalLink, X, Send, ChevronRight, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import PeopleIcon from "@mui/icons-material/People";

import { Question } from '../Question/question';

export type ProgrammingLanguage = 'C++' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export interface ConsoleOutput {
  content: string;
  type: 'info' | 'error' | 'output';
  timestamp: Date;
}

interface CollaborationInterfaceProps {
  roomId: string;
  onLeaveRoom: () => void;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  onCodeChange: (code: string) => void;
  onMessageSend: (message: string) => void;
}

const CollaborationInterface: FC<CollaborationInterfaceProps> = ({
  roomId,
  onLeaveRoom,
  onLanguageChange,
  onCodeChange,
  onMessageSend,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('C++');
  const [code, setCode] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');

  const questionData: Question = {
    qid: 1,
    title: '1. Two Sum',
    complexity: 'Easy',
    description: `Given an array of integers nums and an integer target, 
    return indices of the two numbers such that they add up to target.
    You may assume that each input would have exactly one solution,
    and you may not use the same element twice.
    You can return the answer in any order.`,
    categories: ['Arrays', 'Hash Table']
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as ProgrammingLanguage;
    setSelectedLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onMessageSend(chatMessage);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <Box>
      <AppBar position="static" sx={{ width: "100vw", backgroundColor: "#262928" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img className="h-12 mr-6" alt="peerprep logo" src="/logo-with-text.svg" />
            {/* Flexible space to push buttons to the right */}
            <Box sx={{ flexGrow: 1 }} />
            <Button
              variant="contained"
              onClick={() => null}
              startIcon={<PeopleIcon />}
              sx={{ mx: 3 }}
              className="px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Change Question
            </Button>
            <Button
              variant="contained"
              onClick={() => null}
              startIcon={<PeopleIcon />}
              sx={{ mx: 3 }}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Leave Room
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
    <div className="grid grid-cols-2 gap-4 p-4 h-[calc(100vh-80px)]">
        {/* Left Panel - Question and Chat */}
        <div className="flex flex-col gap-4">
          {/* Question */}
          <Card className="border-gray-700 text-white flex flex-col h-full">
            <CardContent className="p-6 bg-gray-800 flex-grow">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-white">{questionData.title}</h2>
                <span className="px-2 py-1 bg-green-600 rounded text-sm">
                  {questionData.complexity}
                </span>
              </div>
              <p className="mb-4 text-gray-300 whitespace-pre-line text-left">
                {questionData.description}
              </p>
            </CardContent>
          </Card>
          {/* Chat */}
          <Card className="bg-gray-800 border-gray-700 flex flex-col flex-grow">
            <div className="flex items-center px-4 py-2 border-b border-gray-700">
              <ChevronDown className="w-4 h-4" />
              <span>Chat</span>
            </div>
            <CardContent className="p-4 flex-grow">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 rounded px-4 py-2 focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Code Editor & Console */}
        <div className="flex flex-col gap-3">
          {/* Code Editor Header */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <span className="text-s">Code</span>
              <select 
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="bg-gray-700 rounded px-1 py-0.5 text-s"
              >
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
              </select>
            </div>
          </div>

          {/* Code Editor */}
          <Card className="bg-gray-800 border-gray-700 flex-grow">
            <CardContent className="p-0 bg-gray-800 border-gray-700 h-full">
              <textarea
                value={code}
                onChange={handleCodeChange}
                className="w-full h-full bg-gray-800 text-white p-4 rounded font-mono resize-none focus:outline-none text-sm"
                placeholder="Write your code here..."
              />
            </CardContent>
          </Card>

          {/* Console */}
          <Card className="bg-gray-800 border-gray-700 flex-grow">
            <div className="flex items-center px-4 py-2 border-b border-gray-700">
              <ChevronRight className="w-4 h-4" />
              <span>Console</span>
            </div>
            <CardContent className="p-4 h-full bg-gray-900">
              <pre className="text-gray-300">// Console output will appear here</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollaborationInterface;