import React from 'react';

import { useAuthedRoute } from '@/stores/auth-store';

type QuestionAttemptsProps = {
  questionId: number;
};

export const QuestionAttemptsPane: React.FC<QuestionAttemptsProps> = ({ questionId: _q }) => {
  const { userId: _ } = useAuthedRoute();
  return <div />;
};
