import { useState, useEffect } from 'react';
import { Button, Card } from '@nextui-org/react';
import { executeCode } from '../../services/sessionOutputService';
import { socket } from '../../services/sessionSocketService';
import { useTheme } from "next-themes";

type SupportedLanguages = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: SupportedLanguages;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const { theme, resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState<boolean>(false);
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (resolvedTheme) {
      setIsThemeReady(true);
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const handleUpdateOutput = (result: { stderr: string; stdout: string }) => {
      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
      } else {
        setIsError(false);
        setOutput(result.stdout.split("\n"));
      }
    };

    (async () => {
      const resolvedSocket = await socket;
      resolvedSocket?.on('updateOutput', handleUpdateOutput);

      return () => {
        resolvedSocket?.off('updateOutput', handleUpdateOutput);
      };
    })();
  }, []);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);

      // Check if there is an error in the output
      if (result.stderr) {
        setIsError(true);
        setOutput(result.stderr.split("\n"));
      } else {
        setIsError(false);
        setOutput(result.stdout.split("\n"));
      }

      // Emit the result to the server
      const resolvedSocket = await socket;
      resolvedSocket?.emit('codeExecution', result);
    } catch (error: any) {
      // would only occur if api is down
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isThemeReady) return null;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-start mb-2">
        <Button
          className=""
          variant='flat'
          color={`${isError ? 'danger' : 'success'}`}
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? 'Running' : 'Run Code'}
        </Button>
      </div>
      <Card className={`flex-1 p-4 overflow-auto 
        ${isError ? (theme === 'dark' ? 'bg-gradient-to-br from-[#751A1A] to-[#331638]' : 'bg-gradient-to-br from-[#FFA6A6] to-[#FFD4D4]')
          : (theme === 'dark' ? 'bg-gradient-to-br from-[#2055A6] to-[#6F0AD4]' : 'bg-gradient-to-br from-[#A6C8FF] to-[#D4A6FF]')}`}>
        <div className="text-sm overflow-y-auto h-full"> {/* Set font size for the output card */}
          {
            output
              ? output.map((line, index) => <p key={index}>{line}</p>)
              : 'Click "Run Code" to see output here'
          }
        </div>
      </Card>
    </div>
  );
};

export default Output;