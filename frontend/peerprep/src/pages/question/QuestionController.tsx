import React, { useEffect, useState } from 'react';
import QuestionView from './QuestionView';
import { questionService } from './questionService';
import { Question } from './questionService';

const QuestionController: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [auth, setAuth] = useState<boolean>(true);
  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await questionService.getQuestions(setAuth);
      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, []);

  return <QuestionView questions={questions} />;
};

export default QuestionController;
