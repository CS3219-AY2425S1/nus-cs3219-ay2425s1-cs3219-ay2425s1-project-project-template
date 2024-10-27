import { Badge, Group, Space, Stack, Text, Title } from '@mantine/core';

const favoriteTopicsData = [
  { topic: 'Array', solvedQuestions: 3 },
  { topic: 'Linked List', solvedQuestions: 10 },
  { topic: 'Hashmap', solvedQuestions: 12 },
];

function FavoriteTopicsLayout() {
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
      <Stack>
        <Title order={2}>Favorite Topics</Title>
        {favoriteTopics}
      </Stack>
    </Group>
  );
}

export default FavoriteTopicsLayout;
