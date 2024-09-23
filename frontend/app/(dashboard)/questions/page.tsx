"use client";
import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Spinner } from '@chakra-ui/react';
import Link from 'next/link';
import { Question, QuestionComplexity, QuestionTopic } from '../../../types/Question';
import { fetchQuestions } from '../../../hooks/fetchQuestions';

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

  console.log('Questions:', questionData);

  return (
    <div className='px-8 mt-4' style={{ overflowY: 'scroll' }}>
      { isLoading && <Spinner size='xl' /> }
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
            {questionData && questionData.map((question, index) => (
              <Tr key={index}>
                <Td>{question.title}</Td>
                <Td>{question.complexity}</Td>
                <Td>
                  {question.topics.map((topic, idx) => (
                    <span key={idx}>{topic}{idx < question.topics.length - 1 ? ', ' : ''}</span>
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
    </div>
  );
}
