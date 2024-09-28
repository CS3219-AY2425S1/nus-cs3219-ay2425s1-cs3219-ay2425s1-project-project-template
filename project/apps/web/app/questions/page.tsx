"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuestionDto, CreateQuestionDto } from "@repo/dtos/questions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateModal from "./components/CreateModal";
import { createQuestion, fetchQuestions } from "@/lib/api/question";

export default function QuestionRepository() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const { data } = useQuery<QuestionDto[]>({
    queryKey: [QUERY_KEYS.QUESTION],
    queryFn: fetchQuestions,
  });

  const mutation = useMutation({
    mutationFn: (newQuestion: CreateQuestionDto) => createQuestion(newQuestion),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION] });
      setCreateModalOpen(false);
    },
    onError: (error) => {
      console.error("Error creating question:", error);
    },
  });

  const handleCreateQuestion = (newQuestion: CreateQuestionDto) => {
    mutation.mutate(newQuestion);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Questions</h1>
        <Button variant="outline" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <CreateModal
        open={isCreateModalOpen}
        setOpen={setCreateModalOpen}
        onCreate={handleCreateQuestion}
      />

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
