import React, { useEffect, useState } from 'react';
import QuestionView from './QuestionView';
import { questionService } from './questionService';
import { Question } from './questionService';

const QuestionController: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await questionService.getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return <QuestionView questions={questions} />;
};

export default QuestionController;
