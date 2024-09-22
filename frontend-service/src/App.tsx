import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './login'


const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App
