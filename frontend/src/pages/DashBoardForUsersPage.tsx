import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";
import useQuestionList from "../hooks/useQuestionList.tsx";

const DashboardForUsersPage: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const fetchData = useQuestionList(setQuestions);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <Dashboard questions={questions} fetchData={fetchData} />
    </div>
  );
};

export default DashboardForUsersPage;
