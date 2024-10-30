import { Question } from "@/models/Question";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { getAllQuestions } from "@/services/QuestionFunctions";
import { DataTable } from "./data-table";
import moment from "moment";

interface QuestionTableProps {
  isAdmin: boolean;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  isAdmin,
}) => {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true); // To show a loading state

  // Define a refetch function to reload the questions
  const refetch = async () => {
    const questions = await getData();
    setData(questions);
    setLoading(false);
  };

  // Fetch data asynchronously on component mount
  useEffect(() => {
    refetch();
  }, []);

  // Return a loading indicator or the table once data is available
  return (
    <div className="container mx-auto">
      {loading ? (
        <p>Loading...</p> // Show loading text or spinner
      ) : (
        <div className="font-bold">
          <DataTable
            columns={columns(refetch, isAdmin)}
            data={data || []}
            refetch={refetch}
            isAdmin={isAdmin}
          />
        </div>
      )}
    </div>
  );
}

// The async function for fetching data remains the same
async function getData(): Promise<Question[]> {
  const res = await getAllQuestions();

  if (!res.success) {
    console.error("Error fetching data", res.error);
    return [];
  }

  const questions: Question[] = res.data;

  questions.sort((a, b) => {
    const aDate = moment(a.dateCreated);
    const bDate = moment(b.dateCreated);

    return aDate.isBefore(bDate) ? -1 : 1;
  });

  return questions;
}

export default QuestionTable;
