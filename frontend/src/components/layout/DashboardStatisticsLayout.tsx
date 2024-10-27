import { Badge, Group, Space, Stack, Text, Title } from '@mantine/core';

import DifficultyProgressRing from '../progress/DifficultyProgressRing';

const favoriteTopicsData = [
  { topic: 'Array', solvedQuestions: 3 },
  { topic: 'Linked List', solvedQuestions: 10 },
  { topic: 'Hashmap', solvedQuestions: 12 },
];

function DashboardStatisticsLayout() {
  const favoriteTopics = favoriteTopicsData.map((favoriteTopicData, i) => (
    <Group key={i}>
      <Badge variant="light" color="gray">
        {favoriteTopicData.topic}
      </Badge>
      <Space style={{ flexGrow: 1 }} />
      <Text>
        <Text span fw={700}>
          {favoriteTopicData.solvedQuestions}{' '}
        </Text>
        problems solved
      </Text>
    </Group>
  ));

  return (
    <Group p="20px" bg="slate.8" gap="20px" style={{ borderRadius: '4px' }}>
      <Group gap="10px">
        <DifficultyProgressRing
          difficulty="Easy"
          solvedQuestions={22}
          totalQuestions={103}
        />
        <DifficultyProgressRing
          difficulty="Medium"
          solvedQuestions={6}
          totalQuestions={13}
        />
        <DifficultyProgressRing
          difficulty="Hard"
          solvedQuestions={5}
          totalQuestions={8}
        />
      </Group>
      <Stack>
        <Title order={2}>Favorite Topics</Title>
        {favoriteTopics}
      </Stack>
    </Group>
  );
}

export default DashboardStatisticsLayout;
