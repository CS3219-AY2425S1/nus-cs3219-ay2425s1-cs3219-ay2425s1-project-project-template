import { useState, useEffect } from 'react';
import { Button, Card } from '@nextui-org/react';
import { executeCode } from '../../services/sessionOutputService';
import { socket } from '../../services/sessionSocketService';

type SupportedLanguages = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

interface OutputProps {
    editorRef: React.RefObject<any>;
    language: SupportedLanguages;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
    const [output, setOutput] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

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

    return (
        <div className='flex'>
            <p className="">Output</p>
            <Button
                className=""
                variant='flat'
                color="success"
                disabled={isLoading}
                onClick={runCode}
            >
                {isLoading ? 'Running' : 'Run Code'}
            </Button>
            <Card className="flex-1 bg-gradient-to-br from-[#FE9977] to-[#6F0AD4]">
                {
                    output
                        ? output.map((line, index) => <p key={index}>{line}</p>)
                        : 'Click "Run Code" to see output here'
                }
            </Card>
        </div>
    );
};

export default Output;