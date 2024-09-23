"use client";
import { useEffect, useState } from 'react';
import { Table, Text, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { Question, QuestionComplexity, QuestionTopic } from '../../../types/Question';
import { fetchQuestions } from '../../../hooks/fetchQuestions';
import QuestionModal from './QuestionModal';

export default function QuestionsPage() {

  const [isLoading, setIsLoading] = useState(true);
  const [questionData, setQuestionData] = useState<Question[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const questions = await fetchQuestions();
      setQuestionData(questions);
    };
    fetchData();
    setIsLoading(false);
  }, []);

  console.log(questionData);

  return (
    <div className='px-8 mt-4' style={{ overflowY: 'scroll' }}>
    { isLoading ? (
        <div className='flex flex-col justify-center items-center'>
          <Spinner size='xl' thickness='4px' color='blue.500' emptyColor='gray.200' className="m-10" />
          <span className='text-xl text-center'>Loading Questions...</span>
        </div>
      ) : (
      <>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th width="60%">Title</Th>
              <Th width="10%">Difficulty</Th>
              <Th width="30%">Topics</Th>
            </Tr>
          </Thead>
          <Tbody>
            { questionData && questionData.map((question, index) => (
              <Tr key={index}>
                <Td><QuestionModal {...question}/></Td>
                <Td>{difficultyText(question.complexity)}</Td>
                <Td>
                  {question.topics.map((topic, idx) => (
                    topicText(topic, idx)
                  ))}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button colorScheme="teal" onClick={() => alert('Add new question')} className='mt-4 mb-4'>
        Add New Question
      </Button>
      </>
    )}
    </div>
  );
}

export const difficultyText = (complexity: QuestionComplexity) => {
  return (
    <Text color={
      complexity === QuestionComplexity.EASY ? 'green.500' :
      complexity === QuestionComplexity.MEDIUM ? 'yellow.500' :
      complexity === QuestionComplexity.HARD ? 'red.500' : 'gray.500'
    } className='font-medium'>
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
    </Text>
  )
}

export const topicText = (topic: QuestionTopic, idx: number) => {
  return (
    <span key={idx} className='mx-2 bg-gray-200  px-2 py-2 rounded-2xl font-medium'>
      {topic
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      }
    </span>
  )
}
