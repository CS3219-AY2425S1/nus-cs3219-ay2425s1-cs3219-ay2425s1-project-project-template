import { useEffect, useState } from "react";
import { Box, Snackbar } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Text from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { executeCode } from "../../pages/Collaboration/consoleExecute";
import { useSocket } from "../../contexts/SocketContext";
import { useParams } from "react-router-dom";

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const { collabSocketRef } = useSocket();
  const { roomId } = useParams();
  const [output, setOutput] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collabSocketRef.current) {
      console.log("Collab socket error");
      return;
    }
    
    collabSocketRef.current.on("sync-console", (consoleResults: Array<string>) => {
      setOutput(consoleResults);
      
    });

    collabSocketRef.current.on("sync-load", (isLoading: boolean) => {
      setLoading(isLoading);
    })
  }, [])

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setLoading(true);
      collabSocketRef.current?.emit("console-load", roomId, true);
      const { run: result } = await executeCode(language, sourceCode);
      const consoleResults = result.output.split("\n");
      setOutput(consoleResults);
      collabSocketRef.current?.emit("console-change", roomId, consoleResults);
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
        autoHideDuration={5000}
        message="An error occurred."
        />
    } finally {
      collabSocketRef.current?.emit("console-load", roomId, false);
      setLoading(false);
    }
  };

  return (
    <Box height="100%" width="100%">
      <Stack direction='row' alignItems={'center'} marginBottom={1} marginTop={1}>
        <Text fontSize="14px" color='white' marginRight={2}>
            Output:
        </Text>
        <LoadingButton
        variant="contained"
        onClick={runCode}
        loading={loading}
        sx={{
          fontSize: "13px",
          color: "white",
          backgroundColor: "grey.800",
          '&:hover': {
              backgroundColor: "grey.700",
          },
        }}
        >
            Run Code
        </LoadingButton>
      </Stack>
      <Box
        bgcolor='black'
        height="30vh"
        maxHeight={'30vh'}
        width="100%"
        p={2}
        color={isError ? "red.400" : "white"}
        border="1px solid"
        borderColor={isError ? "red.400" : "#333"}
        textAlign={"left"}
        overflow={"auto"}
      >
        {output.length!=0
          ? output.map((line, i) => <Text fontSize={14} fontFamily={"monospace"} color='white' key={i}>{line}</Text>)
          : <Text fontSize={14} color='white'>Click "Run Code" to see the output here</Text>}
      </Box>
    </Box>
  );
};
export default Output;