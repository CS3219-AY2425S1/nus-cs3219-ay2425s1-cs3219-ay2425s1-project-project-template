import React from "react";
import "./App.css";
import QuestionPage from "./pages/Question/question";
import NavBar from "./components/NavBar/navbar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <header className="App-header">
        <QuestionPage />
      </header>
    </div>
  );
}

export default App;
