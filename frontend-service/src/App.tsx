import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import QuestionPage from "./pages/Question";
import QuestionDetails from "../components/question/QuestionDetails";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/">Questions</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/match-me">Match Me</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/my-account" className="account-button">
          My Account
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<QuestionPage />} />
        <Route path="/questions/:id" element={<QuestionDetails />} />
      </Routes>
    </div>
  );
}

export default App;
