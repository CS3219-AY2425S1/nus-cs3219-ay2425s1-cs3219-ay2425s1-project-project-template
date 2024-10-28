import React, { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { Box, Button, Text } from '@chakra-ui/react'

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState('//Start writing your code here..')
  const [codeLanguage, setCodeLanguage] = useState('Javascript')

  const handleEditorChange = (newValue: string | undefined) => {
    setCode(newValue || '')
  }

  return (
    <Box
      width="100%"
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
          <Button size="sm" colorScheme="gray">
            Reset
          </Button>
        </Box>
      </Box>

      {/* Monaco Editor */}
      <Box height="80vh" borderRadius="8px" overflow="hidden">
        <MonacoEditor
          height="100%"
          language={setCodeLanguage}
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
  )
}

export default CodeEditor