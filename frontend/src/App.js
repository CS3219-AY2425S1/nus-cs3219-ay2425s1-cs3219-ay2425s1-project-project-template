
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Question } from "./pages/Question";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/questions/:id' element={<Question />} />
        <Route path="*" element={<p>404: Page Not Found!</p>} />
      </Routes>
    </div>
  );
}

export default App;

