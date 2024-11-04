import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Select, Text } from '@chakra-ui/react'
import { FIREBASE_DB } from '../../FirebaseConfig'
import { ref, onValue, set } from 'firebase/database'
import axios from 'axios'
import QuestionSideBar from './QuestionSidebar'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../../src/utils/fetchWithAuth'
import { shikiToMonaco } from '@shikijs/monaco'
import { createHighlighter } from 'shiki'
import * as monaco from 'monaco-editor'


// support multiple programming languages
const languageType: { [key: string]: string } = {
  javascript: '// Start writing your JavaScript code here...',
  python: '# Start writing your Python code here...',
  java: '// Start writing your Java code here...',
  csharp: '// Start writing your C# code here...',
}

interface CodeEditorProps {
  roomId: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId }) => {
  // const { roomId } = useParams<{ roomId: string }>();
  const [code, setCode] = useState('//Start writing your code here..')
  const [codeLanguage, setCodeLanguage] = useState('Javascript')
  const [leaveRoomMessage, setLeaveRoomMessage] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const navigate = useNavigate()
  const codeRef = ref(FIREBASE_DB, `rooms/${roomId}/code`)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const cancelRef = useRef(null)

  useEffect(() => {
    const setupSyntaxHighlighting = async () => {
      const highlighter = await createHighlighter({
        themes: [
          'github-dark',
          'material-theme-darker',
          'everforest-dark'
        ],
        langs: [
          'javascript',
          'python',
          'java',
          'csharp'
        ],
      })

      shikiToMonaco(highlighter, monaco)

      // register language Ids
      monaco.languages.register({ id: 'javascript' })
      monaco.languages.register({ id: 'python' })
      monaco.languages.register({ id: 'java' })
      monaco.languages.register({ id: 'csharp' })
    }
    setupSyntaxHighlighting().catch(console.error)
  }, [])

  useEffect(() => {
    const unsubscribe = onValue(codeRef, (snapshot) => {
      const updatedCode = snapshot.val()
      if (updatedCode !== null && updatedCode !== code) {
        setCode(updatedCode)
      }
    })
    return () => unsubscribe()
  }, [roomId, codeRef])

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCode(newValue)
      set(codeRef, newValue) // write to firebase
    }
  }

  // Function to handle leaving the room
  const handleLeaveRoom = async () => {

    try {
      const userId = localStorage.getItem("userId")
      const token = localStorage.getItem("token");
      console.log("User ID:", userId)

      if (!userId || !token) {
        console.error("No user ID or token found. Redirecting to login.")
        navigate("/login")
        return
      }

      const response = await axios.post(
        "http://localhost:5001/room/leaveRoom",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `User: ${userId} leaving room`
      );
      setLeaveRoomMessage(response.data.message || "You have left the room.")

      // reset matching status once user has left the room
      await fetchWithAuth("http://localhost:3002/reset-status", { method: "POST" });

      setTimeout(() => {
        navigate("/match-room");
      }, 2000)
    } catch (error) {
      console.error("Error leaving room:", error)
    }
  }

  const handleConfirmLeave = () => {
    setIsDialogOpen(false)
    handleLeaveRoom()
  }

  const handleResetCode = () => {
    setCode(languageType[codeLanguage])
    set(codeRef, languageType[codeLanguage])
  }

  // TODO:
  const handleSelectQuestion = async (questionId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
      console.log("Fetched question details:", response.data)
      setQuestion(response.data);
    } catch (error) {
      console.error("Failed to fetch question details:", error);
    }
  }

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value
    setCodeLanguage(selectedLanguage)
    setCode(languageType[selectedLanguage])
    set(codeRef, languageType[selectedLanguage])
  }

  return (
    <Box display="flex" height="100vh">
      <Box width="500px" flexShrink={0} borderRight="1px solid #e2e8f0">
        <QuestionSideBar onSelectQuestion={handleSelectQuestion}></QuestionSideBar>
      </Box>
      <Box
        flex="1"
        maxWidth="900px"
        margin="auto"
        mt={4}
        p={4}
        borderRadius="8px"
        border="1px solid #e2e8f0"
        bg="gray.50"
      >

        {/* Display Question Details */}
        {question && (
          <Box mb={4} p={4} bg="white" borderRadius="md" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold">{question.title}</Text>
            <Text fontSize="sm" color="gray.600">Category: {question.category}</Text>
            <Text fontSize="sm" color="gray.600">Difficulty: {question.difficulty}</Text>
            <Text mt={2}>{question.description}</Text>
          </Box>
        )}

        {/* Header with toolbar */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
          p={2}
          borderBottom="1px solid #e2e8f0"
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            Code Editor
          </Text>
          <Box display="flex" alignItems="center">
            <Select
              size="sm"
              width="150px"
              mr={3}
              value={codeLanguage}
              onChange={handleLanguageChange}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
            </Select>
            <Button size="sm" colorScheme="red" marginRight={10} onClick={() => setIsDialogOpen(true)}>
              Leave Room
            </Button>
            <Button size="sm" colorScheme="blue" marginRight={10}>
              Run
            </Button>
            <Button size="sm" colorScheme="gray" onClick={handleResetCode}>
              Reset
            </Button>
          </Box>
        </Box>

        {/* Monaco Editor */}
        <Box height="80vh" borderRadius="8px" overflow="hidden">
          <MonacoEditor
            height="100%"
            language={codeLanguage}
            theme="vs-light" // Use a light theme similar to LeetCode
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: 16,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              lineNumbers: "on",
            }}
          />
        </Box>
        {/* Display leave room message */}
        {leaveRoomMessage && (
          <Text color="red.500" mt={4}>
            {leaveRoomMessage}
          </Text>
        )}
        {/* Confirmation Dialog */}
        <AlertDialog
          isOpen={isDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Leave Room
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to leave the room? You will need to rejoin to continue.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                  No
                </Button>
                <Button colorScheme="red" onClick={handleConfirmLeave} ml={3}>
                  Yes, Leave
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  )
}

export default CodeEditor