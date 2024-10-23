import { useEffect, useState } from "react";
import UserNavBar from "../components/UserNavBar.tsx";
import { Dashboard } from "../features/dashboard/index.ts";
import { useQuestionList } from "../features/questions/index.ts";

const DashboardForUsersPage: React.FC = () => {
  const { questions, fetchData } = useQuestionList();

  useEffect(() => {
    fetchData();
  }, []); // IMPT Do not put fetchData in the dependency array so as to avoid infinite renders

  return (
    <div className="w-screen h-screen flex flex-col">
      <UserNavBar />
      <Dashboard questions={questions} fetchData={fetchData} />
    </div>
  );
};

export default DashboardForUsersPage;
