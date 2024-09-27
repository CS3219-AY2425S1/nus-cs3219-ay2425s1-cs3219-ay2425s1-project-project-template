import React, { useEffect, useState } from 'react';
import QuestionView from './QuestionView';
import { questionService } from './questionService';
import { Question } from './questionService';
import { useApiContext } from '../../context/ApiContext';

const QuestionController: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const api = useApiContext();
  
  useEffect(() => {
    // const fetchQuestions = async () => {
    //   const fetchedQuestions = await questionService.getQuestions();
    //   setQuestions(fetchedQuestions);
    // };

    api.get('/questions').then((response) => {
      console.log(response.data) // use the api instance to make post request using axios post method
      // TODO set the question state on successful request
    }).catch((error) => {
      console.log(error)
    });

  }, []);

  return <QuestionView questions={questions} />;
};

export default QuestionController;
