'use client';

import { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import ConsoleCard from './ConsoleCard';
import { toast, useToast } from '@/hooks/use-toast';
import { executeCode } from '../api/codeRunner';

interface CodeEditorProps {
  onMount: OnMount;
  language: string;
  defaultValue?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  onMount,
  language,
  defaultValue = '',
}) => {
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowOutput(false);
      }
    };

    if (showOutput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOutput]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    onMount(editor, monaco);
  };

  const handleRun = () => {
    console.log('Run button clicked');
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      console.log('Setting output:', code);
      runCode(code);
    }
  };

  const runCode = async (code: string) => {
    if (!code) return;
    try {
      const result = await executeCode(language, code);
      console.log(result);
      setOutput(result.split('\n'));
      setShowOutput(true);
    } catch (error) {
      console.log(error);
      toast({
        title: 'An error occurred.',
        description: 'Something went wrong, try running the code again later.',
        duration: 6000,
      });
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex items-center justify-end rounded-t-xl bg-gray-900 px-4 py-2">
        <Button
          onClick={handleRun}
          variant="ghost"
          size="sm"
          className="bg-gray-800 text-gray-100 hover:bg-gray-700"
        >
          Run
          <Play className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div
        className="flex-grow overflow-y-auto bg-gray-900 font-mono text-gray-100"
        style={{
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          onMount={handleEditorMount}
          defaultValue={defaultValue}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {showOutput && (
        <div className="absolute inset-0 flex items-end justify-center bg-black/50">
          <ConsoleCard output={output} ref={cardRef} />
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
