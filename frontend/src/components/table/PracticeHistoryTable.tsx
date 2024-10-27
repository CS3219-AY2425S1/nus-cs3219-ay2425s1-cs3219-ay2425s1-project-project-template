import { Stack, Table, Title } from '@mantine/core';

const attempts = [
  {
    question: 'Two Sum',
    difficulty: 'Easy',
    language: 'java',
    date: 'Sep 23, 2023',
  },
  {
    question: 'Diameter of Binary Tree',
    difficulty: 'Medium',
    language: 'python',
    date: 'Sep 23, 2023',
  },
  {
    question: 'Two Sum',
    difficulty: 'Easy',
    language: 'java',
    date: 'Sep 23, 2023',
  },
];

function PracticeHistoryTable() {
  const rows = attempts.map((attempt, i) => (
    <Table.Tr key={i}>
      <Table.Td>{attempt.question}</Table.Td>
      <Table.Td>{attempt.difficulty}</Table.Td>
      <Table.Td>{attempt.language}</Table.Td>
      <Table.Td>{attempt.date}</Table.Td>
      <Table.Td>View</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack p="20px" bg="slate.8" gap="20px" style={{ borderRadius: '4px' }}>
      <Title order={2}>Practice History</Title>
      <Table
        verticalSpacing="sm"
        highlightOnHover
        highlightOnHoverColor="slate.9"
        borderColor="dark.4"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Question</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Language</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}

export default PracticeHistoryTable;
