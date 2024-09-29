"use client";

import { Suspense, useState } from "react";
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
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateModal from "./components/CreateModal";
import { createQuestion, fetchQuestions } from "@/lib/api/question";
import Link from "next/link";
import DifficultyBadge from "@/components/DifficultyBadge";
import QuestionsSkeleton from "./components/QuestionsSkeleton";
import EmptyPlaceholder from "./components/EmptyPlaceholder";

const QuestionRepositoryContent = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { data } = useSuspenseQuery<QuestionDto[]>({
    queryKey: [QUERY_KEYS.Question],
    queryFn: fetchQuestions,
  });
  const createMutation = useMutation({
    mutationFn: (newQuestion: CreateQuestionDto) => createQuestion(newQuestion),
    onMutate: () => setConfirmLoading(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.Question] });
      setCreateModalOpen(false);
    },
    onSettled: () => setConfirmLoading(false),
    onError: (error) => {
      console.error("Error creating question:", error);
    },
  });

  const handleCreateQuestion = (newQuestion: CreateQuestionDto) => {
    createMutation.mutate(newQuestion);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-semibold">Question Repository</h1>
        <Button
          variant="outline"
          disabled={confirmLoading}
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {data?.length === 0 ? (
        <EmptyPlaceholder />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Categories</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody
            className={`${confirmLoading ? "opacity-50" : "opacity-100"}`}
          >
            {data?.map((question) => (
              <TableRow key={question.id}>
                <TableCell style={{ width: "40%" }}>
                  <Link
                    href={`/question/${question.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {question.q_title}
                  </Link>
                </TableCell>
                <TableCell style={{ width: "10%" }}>
                  <DifficultyBadge complexity={question.q_complexity} />
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {question.q_category.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="mr-2"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CreateModal
        open={isCreateModalOpen}
        setOpen={setCreateModalOpen}
        onCreate={handleCreateQuestion}
      />
    </div>
  );
};

const QuestionRepository = () => {
  return (
    <Suspense fallback={<QuestionsSkeleton />}>
      <QuestionRepositoryContent />
    </Suspense>
  );
};

export default QuestionRepository;
