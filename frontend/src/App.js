
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Question from './Question';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/question' element={<Question />} />
        <Route path="*" element={<p>404: Page Not Found!</p>} />
      </Routes>
    </div>
  );
}

export default App;

