import {
  Badge,
  Group,
  ScrollArea,
  Stack,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { useEffect, useState } from 'react';

import { getQuestionById } from '../../apis/QuestionApi';
import { Question } from '../../types/QuestionType';
import DifficultyBadge from '../badge/DifficultyBadge';

interface DescriptionTabProps {
  questionId: string;
}

function DescriptionTab({ questionId }: DescriptionTabProps) {
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (questionId) {
      getQuestionById(questionId).then(
        (response: Question[]) => {
          setQuestion(response[0]);
        },
        (error: any) => {
          console.log(error);
        },
      );
    }
  }, [questionId]);

  return (
    <ScrollArea h="100%" offsetScrollbars>
      {question && (
        <Stack p="16px" gap="16px">
          <Title order={2}>{question.title}</Title>
          <Group gap="10px">
            <DifficultyBadge difficulty={question.difficulty} />
            {question.topics.map((topic, i) => (
              <Badge key={i} variant="light" color="gray">
                {topic}
              </Badge>
            ))}
          </Group>
          <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </TypographyStylesProvider>
        </Stack>
      )}
    </ScrollArea>
  );
}

export default DescriptionTab;
