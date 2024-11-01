import React, { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Box, Button, Text } from '@chakra-ui/react'
import { FIREBASE_DB } from '../../FirebaseConfig'
import { ref, onValue, set } from 'firebase/database'
import axios from 'axios'
import QuestionSideBar from './QuestionSidebar'
import { useParams } from 'react-router-dom'

interface Question {
  title: string,
  description: string,
  category: string,
  difficulty: string,
}

const CodeEditor: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [code, setCode] = useState('//Start writing your code here..')
  const [codeLanguage, setCodeLanguage] = useState('Javascript')
  const [question, setQuestion] = useState<Question | null>(null)
  const codeRef = ref(FIREBASE_DB, `rooms/${roomId}/code`)

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

  const handleResetCode = () => {
    const initialCode = '//Start writing your code here..'
    setCode(initialCode)
    set(codeRef, initialCode)
  }

  const handleSelectQuestion = async (questionId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/questions/${questionId}`);
      setQuestion(response.data);
    } catch (error) {
      console.error("Failed to fetch question details:", error);
    }
  };

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
          <Box>
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
      </Box>
    </Box>
  )
}

export default CodeEditor