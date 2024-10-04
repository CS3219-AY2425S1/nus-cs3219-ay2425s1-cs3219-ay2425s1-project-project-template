import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionTable from './components/QuestionTable';

function App() {
  return (
    <>
      <div className='App'>
        <Router>
          <Routes>
            <Route path="/" element={<QuestionTable />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
