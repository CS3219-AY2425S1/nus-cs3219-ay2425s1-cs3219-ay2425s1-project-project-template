import { Route, Routes } from "react-router-dom";
import './styles/App.css';
import { Questions } from './pages';

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Questions />} />
      </Routes>
    </div>
  );
}

export default App;
