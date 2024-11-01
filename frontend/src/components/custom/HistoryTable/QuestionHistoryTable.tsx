import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import moment from "moment";
import { QuestionHistory } from "@/models/QuestionHistory";
import { getQuestionHistory } from "@/services/QuestionHistoryFunctions";

const QuestionHistoryTable: React.FC = () => {
  const [data, setData] = useState<QuestionHistory[]>([]);
  const [loading, setLoading] = useState(true); // To show a loading state

  const fetch = async () => {
    const questionHistory: QuestionHistory[] = await getData();
    setData(questionHistory);
    setLoading(false);
  };

  // Fetch data asynchronously on component mount
  useEffect(() => {
    fetch();
  }, []);

  // Return a loading indicator or the table once data is available
  return (
    <div className="container mx-auto">
      {loading ? (
        <p>Loading...</p> // Show loading text or spinner
      ) : (
        <div className="font-bold">
          <DataTable columns={columns()} data={data || []} />
        </div>
      )}
    </div>
  );
};

// The async function for fetching data remains the same
async function getData(): Promise<QuestionHistory[]> {
  const res = await getQuestionHistory();

  if (!res.success) {
    console.error("Error fetching data", res.error);
    return [];
  }

  const questions: QuestionHistory[] = res.data;

  questions.sort((a, b) => {
    const aDate = moment(a.dateAttempted);
    const bDate = moment(b.dateAttempted);

    return aDate.isAfter(bDate) ? -1 : 1;
  });

  return questions;
}

export default QuestionHistoryTable;
