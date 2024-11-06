import { useState } from 'react';
import { Group, Stack, Table, Title, Modal, Tabs } from '@mantine/core';
import { PracticeHistoryItem } from '../../types/History';
import  CodeEditor  from '../codeEditor/CodeEditor';
import { langs } from '@uiw/codemirror-extensions-langs';
import DescriptionTab from '../tabs/DescriptionTab';

type SupportedLanguages = keyof typeof langs;

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function QuestionTab({ questionId }: { questionId: string }) {
  return (
    <Tabs
      defaultValue="description"
      h="calc(100% - 160px)"
      bg="slate.9"
      p="10px"
      style={{ borderRadius: '4px' }}
    >
      <Tabs.List>
        <Tabs.Tab value="description">Description</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="description" h="calc(100% - 36px)">
        <DescriptionTab questionId={questionId} />
      </Tabs.Panel>
    </Tabs>
  );
}

function PracticeRoom({ practiceData }: { practiceData: PracticeHistoryItem }) {
  const programmingLanguage = practiceData.programmingLanguage.toLowerCase() as SupportedLanguages;

  return (
    <>
      <Group h="90vh" bg="slate.8" gap="10px" p="10px" align="flex-start">
        <Stack h="100%" w="500px" gap="10px">
          <QuestionTab questionId={practiceData.questionId.toString()} />
        </Stack>

        <Stack
          h="100%"
          w="calc(100% - 510px)"
          gap={0}
          bg="slate.9"
          style={{ borderRadius: '4px' }}
        >
          <CodeEditor
            code={practiceData.textWritten}
            setCode={() => {}}
            extensions={[
              langs[programmingLanguage](),
            ]}
            readOnly={true}
          />
        </Stack>
      </Group>
    </>
  );
}

function PracticeHistoryTable({ attempts }: { attempts: PracticeHistoryItem[] }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<PracticeHistoryItem | null>(null);

  const openModal = (attempt: PracticeHistoryItem) => {
    setSelectedAttempt(attempt);
    setModalOpen(true);
  };

  const rows = attempts.map((attempt, i) => (
    <Table.Tr key={i}>
      <Table.Td>{attempt.questionName}</Table.Td>
      <Table.Td>{attempt.questionDifficulty}</Table.Td>
      <Table.Td>{attempt.programmingLanguage}</Table.Td>
      <Table.Td>{formatDate(attempt.datetime)}</Table.Td>
      <Table.Td onClick={() => openModal(attempt)} style={{ cursor: 'pointer' }}>
        View
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack p="20px" bg="slate.8" gap="20px" style={{ borderRadius: '4px' }}>
        <Title order={2}>Practice History</Title>
        <Table verticalSpacing="sm" highlightOnHover>
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

      <Modal
        opened={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={
          selectedAttempt
            ? `Review: ${selectedAttempt.questionName } on ${formatDate(selectedAttempt.datetime)} in ${selectedAttempt.programmingLanguage}.`
            : 'Review'
        }
        fullScreen
        radius={0}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        {selectedAttempt && <PracticeRoom practiceData={selectedAttempt} />}
      </Modal>
    </>
  );
}

export default PracticeHistoryTable;
