import { Route, Routes } from "react-router-dom";
import logo from './styles/logo.svg';
import './styles/App.css';
import { Home, Questions } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
