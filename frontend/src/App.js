
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Question } from "./pages/Question";
import { UserPage } from "./pages/UserPage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Match } from "./pages/Match";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/questions/:id' element={<Question />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="/match" element={<Match />} />
        <Route path="*" element={<p>404: Page Not Found!</p>} />
      </Routes>
    </div>
  );
}

export default App;

