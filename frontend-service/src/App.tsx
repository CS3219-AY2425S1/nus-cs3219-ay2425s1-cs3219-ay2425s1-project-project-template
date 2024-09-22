import { Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './login';
import Navbar from './navbar';


const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};


export default App
