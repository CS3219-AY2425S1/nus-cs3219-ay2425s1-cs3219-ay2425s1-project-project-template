"use client";

import { useEffect, useState, useRef } from 'react';
import { Table, Text, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Spinner, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { TrashIcon } from '@/public/icons/TrashIcon';
import Link from 'next/link';
import { Question, QuestionComplexity, QuestionTopic } from '@/types/Question';
import { fetchQuestions, deleteQuestion } from '@/services/questionService';
import QuestionModal from './QuestionModal';

export default function QuestionsPage() {

  const [isLoading, setIsLoading] = useState(true);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const fetchData = async () => {
    const questions = await fetchQuestions();
    setQuestionData(questions);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedQuestionId) {
      await deleteQuestion(selectedQuestionId);
      fetchData();
      setIsAlertOpen(false);
      setSelectedQuestionId(null);
    }
  };

  const openAlert = (id: string) => {
    setSelectedQuestionId(id);
    setIsAlertOpen(true);
  };

  return (
    <div className='px-8 mt-4' style={{ overflowY: 'scroll' }}>
      {isLoading ? (
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
                  <Th width="50%">Title</Th>
                  <Th width="10%">Difficulty</Th>
                  <Th width="30%">Topics</Th>
                  <Th width="10%">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questionData && questionData.map((question, index) => (
                  <Tr key={index}>
                    <Td><QuestionModal {...question} /></Td>
                    <Td>{difficultyText(question.complexity)}</Td>
                    <Td>
                      {question.topics.map((topic, idx) => (
                        topicText(topic, idx)
                      ))}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Delete question"
                        icon={<TrashIcon />}
                        onClick={() => openAlert(question._id)}
                        variant="ghost"
                        _hover={{ bg: 'lightblue' }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Link href="./questions/create" passHref>
            <Button colorScheme="teal" className='mt-4 mb-4'>
              Add New Question
            </Button>
          </Link>
        </>
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Question
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
    <span key={idx} className='mx-2 bg-gray-200  px-3 py-2 rounded-2xl font-medium'>
      {topic
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      }
    </span>
  )
}
