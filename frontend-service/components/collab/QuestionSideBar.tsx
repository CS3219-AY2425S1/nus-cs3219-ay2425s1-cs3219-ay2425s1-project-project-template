import React, { useEffect, useState } from 'react'
import { Box, Button, List, ListItem, Text } from '@chakra-ui/react'
import axios from 'axios'

interface Question {
  questionId: string,
  title: string,
  difficulty: string,
}

interface QuestionSideBarProps {
  onSelectQuestion: (questionId: string) => void;
}

const QuestionSideBar: React.FC<QuestionSideBarProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:8080/api/questions').then(response => {
      setQuestions(response.data)
    }).catch(error => console.error("Failed to fetch questions", error))
  }, [])

  return (
    <Box width={isOpen ? '300px' : 0} transition="width 0.3s" bg="gray 0.5" p={isOpen ? 4 : 0}>
      <Button onClick={() => setIsOpen(!isOpen)} mb={4}>
        {isOpen ? "Close" : "Open"} Questions
      </Button>
      {isOpen && (
        <List spacing={3}>
          {questions.map((question) => <ListItem key={question.questionId}>
            <Button variant="link" onClick={() => onSelectQuestion(question.questionId)}>
              {question.title} - {question.difficulty}
            </Button>
          </ListItem>)}
        </List>
      )}
    </Box>
  )
}

export default QuestionSideBar