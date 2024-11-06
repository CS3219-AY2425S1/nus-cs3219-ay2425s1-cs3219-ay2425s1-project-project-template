import React, { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import axios from 'axios'

interface Question {
  questionId: string,
  title: string,
  description: string,
  category: string[],
  difficulty: string,
  link: string,
}

interface QuestionSideBarProps {
  assignedQuestionId: string;
}

const QuestionSideBar: React.FC<QuestionSideBarProps> = ({ assignedQuestionId }) => {
  const [assignedQuestion, setAssignedQuestion] = useState<Question | null>(null)

  useEffect(() => {
    if (assignedQuestionId) {
      axios.get(`http://localhost:8080/api/questions/${assignedQuestionId}`).then(response => {
        console.log("Fetched question details:", response.data)
        setAssignedQuestion(response.data)
      }).catch(error => console.error("Failed to fetch question details", error))
    }
  }, [assignedQuestionId])


  return (
    <Box>
      {!assignedQuestionId ? (
        <Text color="red.500">Error: No question ID provided.</Text>
      ) : (
        <Box mb={4} p={4} bg="white" borderRadius="md">
          <Text fontSize="xl" fontWeight="bold">{assignedQuestion?.title}</Text>
          <Text color="gray.600">Category: {assignedQuestion?.category.join(', ')}</Text>
          <Text color="gray.600">Difficulty: {assignedQuestion?.difficulty}</Text>
          <Text color="gray.600">{assignedQuestion?.description}</Text>
        </Box>
      )}
    </Box>
  )
}

export default QuestionSideBar