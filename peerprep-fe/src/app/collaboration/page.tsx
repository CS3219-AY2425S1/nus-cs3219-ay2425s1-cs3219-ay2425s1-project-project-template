'use client';

import ProblemCodeEditor from '@/components/problems/ProblemCodeEditor';
import ProblemDescriptionPanel from '@/components/problems/ProblemDescriptionPanel';
import ProblemTable from '@/components/problems/ProblemTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFilteredProblems } from '@/hooks/useFilteredProblems';
import { DEFAULT_CODE, SUPPORTED_PROGRAMMING_LANGUAGES } from '@/lib/constants';
import { Problem } from '@/types/types';
import { UserCircle } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco'
import { editor as MonacoEditor } from 'monaco-editor';

const TURN_SERVER_IP = '34.124.196.27';

const CollaborationPage = () => {
  const [selectionProblem, setSelectionProblem] = useState<Problem | null>(
    null,
  );
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState(SUPPORTED_PROGRAMMING_LANGUAGES[0]);
  const { problems, isLoading } = useFilteredProblems();

  // Layout states
  const [leftWidth, setLeftWidth] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const sockServerURI = "ws://localhost:4444";

  // Handle dragging of the divider
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)));
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    const doc = new Y.Doc(); // a collection of shared objects -> Text
    const provider = new WebsocketProvider("ws://localhost:4444", "test-room", doc);
    const type = doc.getText("monaco"); // Get the shared YJS text object

    // Get the model from the editor
    const model = editorRef.current?.getModel();

    // Check if model is valid
    if (editorRef.current && model) {
      // Bind YJS to Monaco only if the model is not null
      const binding = new MonacoBinding(type, model, new Set([editorRef.current]), provider.awareness);
    } else {
      console.error("Monaco editor model is null");
    }
  };

  // Handle selection of a problem
  const handleCallback = (id: number) => {
    const problem = problems.find((p) => p._id === id);
    if (problem) {
      setSelectionProblem(problem);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-900 p-6 pt-24 text-gray-100"
      ref={containerRef}
    >
      <div
        className="h-full overflow-y-auto p-6"
        style={{ width: `${leftWidth}%` }}
      >
        {selectionProblem ? (
          <ProblemDescriptionPanel
            problem={selectionProblem}
            resetQuestion={() => setSelectionProblem(null)}
          />
        ) : (
          <>
            <h2 className="mb-4 text-2xl font-bold">Choose a question</h2>
            <ProblemTable
              problems={problems}
              isLoading={isLoading}
              rowCallback={handleCallback}
            />
          </>
        )}
      </div>

      <div
        className="flex w-2 cursor-col-resize items-center justify-center bg-gray-600 transition-colors duration-200 hover:bg-gray-500"
        onMouseDown={handleMouseDown}
      >
        <div className="h-8 w-1 rounded-full bg-gray-400" />
      </div>

      <div
        className="flex h-full flex-col overflow-y-auto bg-gray-800 p-6"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="mb-4 flex justify-between">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_PROGRAMMING_LANGUAGES.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              onClick={() => {
                console.log('Clicked user');
              }}
            >
              <UserCircle className="h-6 w-6 text-gray-300" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              onClick={() => {
                console.log('Clicked user');
              }}
            >
              <UserCircle className="h-6 w-6 text-gray-300" />
            </Button>
          </div>
        </div>

        <ProblemCodeEditor
          value={code}
          onMount={handleEditorMount}
        />
      </div>
    </div>
  );
};

export default CollaborationPage;
