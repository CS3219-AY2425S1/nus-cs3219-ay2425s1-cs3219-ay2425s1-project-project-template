import { Badge, Group, Stack, Title } from '@mantine/core';
import '@mantine/core/styles.css';

import DifficultyBadge from '../badge/DifficultyBadge';

interface DescriptionTabProps {
  title: string;
  difficulty: string;
  topics: string[];
  description: string;
}

function DescriptionTab({
  title,
  difficulty,
  topics,
  description,
}: DescriptionTabProps) {
  return (
    <Stack p="16px" gap="16px">
      <Title order={2}>{title}</Title>
      <Group gap="10px">
        <DifficultyBadge difficulty={difficulty} />
        {topics.map((topic, i) => (
          <Badge key={i} variant="light" color="gray">
            {topic}
          </Badge>
        ))}
      </Group>
      {description}
    </Stack>
  );
}

export default DescriptionTab;
