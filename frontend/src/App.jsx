import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import QuestionTable from './components/QuestionTable';

function App() {


  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setQuestions(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchQuestions();

  }, [])

  const deleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:4000/question/{questionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        console.log(`successfully deleted question {questionId}`);
        // refetch new question without deleted question
        fetchQuestions();
      }
    } catch {
      console.log(error);
    }
  }

  const createQuestion = async (questionId, questionName, questionDescription, questionTopics, link, questionDifficulty) => {
    try {
      const response = await fetch(`http://localhost:4000/question`, {
        method: 'POST',
        body: JSON.stringify({
          id: questionId,
          name: questionName,
          description: questionDescription,
          topics: questionTopics,
          leetcode_link: link,
          difficulty: questionDifficulty,
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.success) {
        console.log(`successfully added question {questionId}`);
        // refetch new question without deleted question
        fetchQuestions();
      }
    } catch {
      console.log(error);
    }
  }
  
  
  return (
    <>
      <Navbar/>
      <div className='question-list'>
          <QuestionTable questions={questions} handleDelete={deleteQuestion} />
      </div>
    </>
  )
}

export default App
