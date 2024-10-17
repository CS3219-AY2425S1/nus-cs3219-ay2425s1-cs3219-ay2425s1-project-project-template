import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.tsx";
import Dashboard from "../components/Dashboard/Dashboard.tsx";
import useQuestionList from "../hooks/useQuestionList.tsx";

const DashboardForUsersPage: React.FC = () => {
  const {questions, fetchData} = useQuestionList();
  // const [isUserMatchingModalOpen, setIsUserMatchingModalOpen] = useState(false);
  useEffect(() => {
    fetchData();
  }, []); // IMPT Do not put fetchData in the dependency array so as to avoid infinite renders

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      {/* { isUserMatchingModalOpen && <UserMatchingModal onClose={() => setIsUserMatchingModalOpen(false)} /> } */}
      <Dashboard questions={questions} fetchData={fetchData} />
    </div>
  );
};

export default DashboardForUsersPage;
