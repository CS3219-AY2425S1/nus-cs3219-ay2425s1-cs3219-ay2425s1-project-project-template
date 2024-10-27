import { Group } from '@mantine/core';

import DifficultyProgressRing from '../../progress/DifficultyProgressRing';

function ProgressLayout() {
  return (
    <Group p="20px" bg="slate.8" gap="10px" style={{ borderRadius: '4px' }}>
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
  );
}

export default ProgressLayout;
