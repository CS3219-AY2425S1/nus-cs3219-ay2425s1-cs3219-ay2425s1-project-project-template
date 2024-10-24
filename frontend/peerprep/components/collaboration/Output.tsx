import { useState, useEffect } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { executeCode } from '../../app/api/services/sessionOutputService';
import { socket } from '../../app/api/services/sessionSocketService';

type SupportedLanguages = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

interface OutputProps {
    editorRef: React.RefObject<any>;
    language: SupportedLanguages;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
    const toast = useToast();
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

        socket.on('updateOutput', handleUpdateOutput);

        return () => {
            socket.off('updateOutput', handleUpdateOutput);
        };
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
            socket.emit('codeExecution', result);
        } catch (error: any) {
            // would only occur if api is down
            console.log(error);
            toast({
                title: 'An error occurred.',
                description: error.message || 'Unable to run code',
                status: 'error',
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="50%">
            <Text mb={2} fontSize="lg">Output</Text>
            <Button
                variant='outline'
                colorScheme='green'
                mb={4}
                isLoading={isLoading}
                onClick={runCode}
            >
                Run Code
            </Button>
            <Box
                height="75vh"
                p={2}
                color={isError ? 'red.400' : ''}
                border="1px solid"
                borderRadius={4}
                borderColor={isError ? 'red.500' : '#333'}
            >
                {
                    output
                        ? output.map((line, index) => <Text key={index}>{line}</Text>)
                        : 'Click "Run Code" to see output here'
                }
            </Box>
        </Box>
    );
};

export default Output;
