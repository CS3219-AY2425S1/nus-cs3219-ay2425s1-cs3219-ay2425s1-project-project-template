"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { apiCall } from "@/lib/api/apiClient";
import { Question } from "@/types/question";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fetchQuestions = async (): Promise<Question[]> => {
  return await apiCall("get", "/questions");
};

export default function Home() {
  const { data } = useQuery<Question[]>({
    queryKey: [QUERY_KEYS.QUESTION],
    queryFn: fetchQuestions,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Questions</h1>
        <Button
          className="text-md font-semibold"
          variant="ghost"
          onClick={() => console.log("Create button clicked")}
        >
          + Create
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.q_title}</TableCell>
              <TableCell>{question.q_complexity}</TableCell>
              <TableCell>
                {question.q_category.map((category) => (
                  <Badge key={category} variant="secondary" className="mr-2">
                    {category}
                  </Badge>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
