import { useState } from "react";
import { Box, Snackbar } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Text from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { executeCode } from "../../pages/Collaboration/consoleExecute";

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        autoHideDuration={5000}
        message="An error occurred."
        />
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Stack direction='row' alignItems={'center'}>
        <Text fontSize="lg" color='black' marginRight={2}>
            Output:
        </Text>
        <LoadingButton variant="outlined" onClick={runCode} loading={loading}>
            Run Code
        </LoadingButton>
      </Stack>
      <Box
        bgcolor='black'
        height="100%"
        width="100%"
        p={2}
        color={isError ? "red.400" : "white"}
        border="1px solid"
        borderColor={isError ? "red.500" : "#333"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};
export default Output;