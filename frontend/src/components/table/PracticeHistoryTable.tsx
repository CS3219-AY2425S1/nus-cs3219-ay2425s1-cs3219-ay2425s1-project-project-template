import { Stack, Table, Title } from '@mantine/core';

import { PracticeHistoryItem } from '../../types/History';

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function PracticeHistoryTable({ attempts }: { attempts: PracticeHistoryItem[] }) {
  const rows = attempts.map((attempt, i) => (
    <Table.Tr key={i}>
      <Table.Td>{attempt.questionName}</Table.Td>
      <Table.Td>{attempt.questionDifficulty}</Table.Td>
      <Table.Td>{attempt.programmingLanguage}</Table.Td>
      <Table.Td>{formatDate(attempt.datetime)}</Table.Td>
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
