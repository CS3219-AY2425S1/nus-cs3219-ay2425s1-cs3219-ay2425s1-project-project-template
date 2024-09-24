import {
  Accordion,
  AppShell,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useState } from 'react';

interface Question {
  id: string;
  title: string;
  description: string;
}

function QuestionEditor() {
  const [questions, questionsHandlers] = useListState<Question>([
    {
      id: '1',
      title: 'Reverse a String',
      description:
        'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. \n\nExample 1: Input: s = ["h","e","l","l","o"] Output: ["o","l","l","e","h"] Example 2: Input: s = ["H","a","n","n","a"," h"] Output: ["h","a","n","n","a","H"] Constraints: 1 <= s.length <= 105 s[i] is a printable ascii character.',
    },
    {
      id: '2',
      title: 'Linked List Cycle Detection',
      description:
        'Implement a function to detect if a linked list contains a cycle.',
    },
    {
      id: '3',
      title: 'Roman to Integer',
      description: 'Given a roman numeral, convert it to an integer. ',
    },
    {
      id: '4',
      title: 'Add Binary',
      description:
        'Given two binary strings a and b, return their sum as a binary string. ',
    },
    {
      id: '5',
      title: 'Fibonacci Number',
      description:
        'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1 F(n) = F(n - 1) + F(n - 2), for n > 1. Given n, calculate F(n). ',
    },
    {
      id: '6',
      title: 'Implement Stack using Queues',
      description:
        'Implement a last-infirst-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty). ',
    },
    {
      id: '7',
      title: 'Combine Two Tables',
      description:
        'Given table Person with the following columns: 1. personId (int) 2. lastName (varchar) 3. firstName (varchar) personId is the primary key. And table Address with the following columns: 1. addressId (int) 2. personId (int) 3. city (varchar) 4. state (varchar) addressId is the primary key. Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead. Return the result table in any order',
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addQuestion = () => {
    if (newTitle.trim() && newDescription.trim()) {
      questionsHandlers.append({
        id: Date.now().toString(),
        title: newTitle,
        description: newDescription,
      });
      setNewTitle('');
      setNewDescription('');
      setIsAddModalOpen(false);
    }
  };

  const deleteQuestion = (id: string) => {
    questionsHandlers.filter((item) => item.id !== id);
  };

  const startEditing = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question) {
      setEditingId(id);
      setNewTitle(question.title);
      setNewDescription(question.description);
      setIsUpdateModalOpen(true);
    }
  };

  const updateQuestion = () => {
    if (editingId && newTitle.trim() && newDescription.trim()) {
      questionsHandlers.applyWhere(
        (item) => item.id === editingId,
        (item) => ({ ...item, title: newTitle, description: newDescription }),
      );
      setEditingId(null);
      setNewTitle('');
      setNewDescription('');
      setIsUpdateModalOpen(false);
    }
  };

  const renderDescription = (description: string) => {
    return description.split('\n').map((paragraph, index) => (
      <Text
        key={index}
        mb={index < description.split('\n').length - 1 ? 'md' : 0}
      >
        {paragraph}
      </Text>
    ));
  };

  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <AppShell.Header px="40px" py="16px" bg="slate.8">
        <Group justify="space-between">
          <a href="." className="logo">
            <Title c="white">PeerPrep</Title>
          </a>
          <Button>Log in</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Main
        h="calc(100vh - 80px)"
        w="100%"
        bg="slate.9"
        style={{ overflowY: 'auto' }}
      >
        <Container mt="xl" size="90%">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="apart" mb="md">
              <Title order={2}>Question Manager</Title>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Question
              </Button>
            </Group>
            <Accordion
              styles={{
                root: {
                  width: '100%',
                },
                item: {
                  marginBottom: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                },
                control: {
                  padding: '10px',
                },
                content: {
                  padding: '10px',
                },
              }}
            >
              {questions.map((question) => (
                <Accordion.Item key={question.id} value={question.id}>
                  <Accordion.Control>{question.title}</Accordion.Control>
                  <Accordion.Panel>
                    {renderDescription(question.description)}
                    <Group>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => startEditing(question.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        color="red"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card>

          <Modal
            opened={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Add New Question"
            size="md"
            centered
            closeButtonProps={{ size: 'xs' }}
          >
            <Stack>
              <TextInput
                label="Title"
                placeholder="Enter question title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.currentTarget.value)}
              />
              <Textarea
                label="Description"
                placeholder="Enter question description"
                autosize
                minRows={1}
                value={newDescription}
                onChange={(event) =>
                  setNewDescription(event.currentTarget.value)
                }
              />
              <Button onClick={addQuestion}>Add Question</Button>
            </Stack>
          </Modal>

          <Modal
            opened={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title="Update Question"
            size="md"
            centered
            closeButtonProps={{ size: 'sm' }}
          >
            <Stack>
              <TextInput
                label="Title"
                placeholder="Enter question title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.currentTarget.value)}
              />
              <Textarea
                label="Description"
                placeholder="Enter question description"
                autosize
                minRows={1}
                value={newDescription}
                onChange={(event) =>
                  setNewDescription(event.currentTarget.value)
                }
              />
              <Button onClick={updateQuestion}>Update Question</Button>
            </Stack>
          </Modal>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default QuestionEditor;
