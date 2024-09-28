import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import QuestionTable from './components/QuestionTable';

function App() {


  const [questions, setQuestions] = useState([]);
  
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
    console.log('fetched')
  }

  useEffect(() => {
    
    fetchQuestions();

  }, [])

  const deleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:4000/question/${questionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
    
      console.log(`successfully deleted question ${questionId}`);
      // refetch new question without deleted question
      fetchQuestions();
    
    } catch {
      console.log(error);
    }
  }

  const createQuestion = async (questionId, questionName, questionDescription, questionTopics, link, questionDifficulty) => {
    try {
      const response = await fetch('http://localhost:4000/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate that the request body is JSON
        },
        body: JSON.stringify({
          id: Number(questionId),
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
      console.log(data);
      console.log(`successfully added question ${questionId}`);
      // refetch new question without deleted question
      fetchQuestions();
      // if (data.success) {
      //   console.log(`successfully added question ${questionId}`);
      //   // refetch new question without deleted question
      //   fetchQuestions();
      // }
    } catch (error) {
      console.log(error);
    }
  }

  const editQuestion = async (questionId, questionName, questionDescription, questionTopics, link, questionDifficulty) => {
    try {
      const response = await fetch(`http://localhost:4000/question/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Indicate that the request body is JSON
        },
        body: JSON.stringify({
          id: Number(questionId),
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
      console.log(data);
      console.log(`successfully edited question ${questionId}`);
      // refetch new question with edited question
      fetchQuestions();
      // if (data.success) {
      //   console.log(`successfully added question ${questionId}`);
      //   // refetch new question without deleted question
      //   fetchQuestions();
      // }
    } catch (error) {
      console.log(error);
    }
  }
  
  
  return (
    <>
      <div className='question-list'>
          <QuestionTable questions={questions} handleDelete={deleteQuestion} handleCreate={createQuestion} handleEdit={editQuestion} />
      </div>
    </>
  )
}

export default App
