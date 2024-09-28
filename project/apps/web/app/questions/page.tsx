"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  QuestionDto,
  CreateQuestionDto,
  UpdateQuestionDto,
} from "@repo/dtos/questions";
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
import EditModal from "./components/EditModal";
import {
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
} from "@/lib/api/question";
import DeleteModal from "./components/DeleteModal";
import Link from "next/link";
import DifficultyBadge from "@/components/DifficultyBadge";

const QuestionRepository = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuestionDto | null>(null);
  const [delQuestion, setDelQuestion] = useState<QuestionDto | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { data } = useQuery<QuestionDto[]>({
    queryKey: [QUERY_KEYS.QUESTION],
    queryFn: fetchQuestions,
  });

  const createMutation = useMutation({
    mutationFn: (newQuestion: CreateQuestionDto) => createQuestion(newQuestion),
    onMutate: () => setConfirmLoading(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION] });
      setCreateModalOpen(false);
    },
    onSettled: () => setConfirmLoading(false),
    onError: (error) => {
      console.error("Error creating question:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedQuestion: UpdateQuestionDto) =>
      updateQuestion(updatedQuestion),
    onMutate: () => setConfirmLoading(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION] });
      setEditModalOpen(false);
    },
    onSettled: () => setConfirmLoading(false),
    onError: (error) => {
      console.error("Error updating question:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onMutate: () => setConfirmLoading(true),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUESTION] });
      setDeleteModalOpen(false);
    },
    onSettled: () => setConfirmLoading(false),
    onError: (error) => {
      console.error("Error deleting question:", error);
    },
  });

  const handleCreateQuestion = (newQuestion: CreateQuestionDto) => {
    createMutation.mutate(newQuestion);
  };

  const handleEditQuestion = (updatedQuestion: UpdateQuestionDto) => {
    updateMutation.mutate(updatedQuestion);
  };

  const handleDeleteQuestion = (id: string) => {
    deleteMutation.mutate(id);
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
              <TableCell style={{ width: "30%" }}>
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
                    <Badge key={category} variant="secondary" className="mr-2">
                      {category}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell style={{ width: "10%" }}>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={confirmLoading}
                    onClick={() => {
                      setEditQuestion(question);
                      setEditModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={confirmLoading}
                    onClick={() => {
                      setDelQuestion(question);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateModal
        open={isCreateModalOpen}
        setOpen={setCreateModalOpen}
        onCreate={handleCreateQuestion}
      />

      {editQuestion && (
        <EditModal
          open={isEditModalOpen}
          setOpen={setEditModalOpen}
          onSubmit={handleEditQuestion}
          initialValues={editQuestion}
        />
      )}

      {delQuestion && (
        <DeleteModal
          open={isDeleteModalOpen}
          setOpen={setDeleteModalOpen}
          onDelete={() => handleDeleteQuestion(delQuestion.id)}
          questionTitle={delQuestion.q_title}
        />
      )}
    </div>
  );
};

export default QuestionRepository;
