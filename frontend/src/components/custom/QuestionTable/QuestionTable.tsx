import { Question } from "@/models/Question";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { getAllQuestions } from "@/services/QuestionFunctions";
import { DataTable } from "./data-table";

function QuestionTable() {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true); // To show a loading state

  // Fetch data asynchronously on component mount
  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
      setLoading(false); // Once data is fetched, stop loading
    }
    fetchData();
  }, []);

  // Return a loading indicator or the table once data is available
  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <p>Loading...</p> // Show loading text or spinner
      ) : (
        <div className="font-bold">
          <DataTable columns={columns} data={data || []} />
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
    const aDate = new Date(a.dateCreated).getTime();
    const bDate = new Date(b.dateCreated).getTime();
    return aDate - bDate;
  });

  return questions;
}

export default QuestionTable;
