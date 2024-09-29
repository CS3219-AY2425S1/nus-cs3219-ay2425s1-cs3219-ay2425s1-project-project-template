import React from "react";
import AdminNavBar from "../components/AdminNavBar.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";

const DashboardPage: React.FC = () => {
  const [questions, setQuestions] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions", {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:8080",
          },
        });
        const data = await response.json();
        setQuestions(data._embedded.questionList);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <AdminNavBar setQuestions={setQuestions}/>
      <Dashboard questions={questions} />
    </div>
  );
};

export default DashboardPage;
