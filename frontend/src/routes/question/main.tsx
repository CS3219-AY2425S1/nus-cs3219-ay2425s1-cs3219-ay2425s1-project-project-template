import { useEffect, useState } from 'react';
import { columns } from './columns';
import { QuestionTable } from './question-table';
import { fetchQuestions, Question } from './logic';

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchQuestions();
      setQuestions(result.questions);
      setTotalQuestions(result.totalQuestions);
    };

    fetchData();
  }, []);

  return (
    <div className='container mx-auto py-10'>
      <QuestionTable columns={columns} data={questions} totalQuestions={totalQuestions} />
    </div>
  );
}
