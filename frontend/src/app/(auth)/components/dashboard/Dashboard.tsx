import { getUserHistoryData } from "@/api/dashboard";
import DashboardCard from "@/app/(auth)/components/dashboard/DashboardCard";
import { DashboardDataTable } from "@/app/(auth)/components/dashboard/DashboardDataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { TCombinedSession } from "@/types/dashboard";
import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";

const AuthDashboard = () => {
  const { id } = useAuth();
  const [data, setData] = useState<TCombinedSession[]>([]);

  useEffect(() => {
    getUserHistoryData(id).then((userHistory) => {
      setData(userHistory);
    });
  }, [id]);

  return (
    <Container className="flex flex-col gap-y-5">
      <div className="flex flex-row w-full gap-8">
        <DashboardCard
          cardTitleLabel="Questions Attempted"
          cardBodyLabel={`${data.length}`}
          cardFooterLabel={`${data.filter(question => question.complexity == "easy").length} easy, 
            ${data.filter(question => question.complexity == "medium").length} medium, 
            ${data.filter(question => question.complexity == "hard").length} hard`}
        />
        <Button className="w-full self-end flex gap-3" size={"lg"}>
          <IoMdSearch />
          <span>Find Interview Peer</span>
        </Button>
      </div>
      <DashboardDataTable data={data}/>
    </Container>
  );
};

export default AuthDashboard;
