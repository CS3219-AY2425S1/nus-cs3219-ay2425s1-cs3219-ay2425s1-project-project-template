import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { useAuthedRoute } from '@/stores/auth-store';

type QuestionAttemptsProps = {
  questionId: number;
};

export const QuestionAttemptsPane: React.FC<QuestionAttemptsProps> = ({ questionId: _q }) => {
  const { userId } = useAuthedRoute();
  const { data: _ } = useQuery({
    queryKey: ['question', 'attempts', userId],
    enabled: false,
    queryFn: async () => {},
  });
  return <div />;
};
