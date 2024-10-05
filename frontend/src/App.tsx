import React from "react";
import "./App.css";
import QuestionPage from "./pages/Question/page";
import NavBar from "./components/NavBar/navbar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="Content">
        <QuestionPage />
      </div>
    </div>
  );
}

export default App;
