import React from "react";
import { useNavigate } from "react-router-dom";
import "@/css/styles.css";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/title";
import QuestionHistoryTable from "@/components/custom/HistoryTable/QuestionHistoryTable";

const HistoryPageView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main
      className="h-screen w-screen p-5"
      style={{ height: "100%", backgroundColor: "white" }}
    >
      <div className="flex justify-between items-center mx-5">
        <Title title="Question History" />
        <Button
          variant="outline"
          className="text-left text-muted-foreground"
          onClick={() => navigate("/questions")}
        >
          Back
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <QuestionHistoryTable />
    </main>
  );
};

export default HistoryPageView;
