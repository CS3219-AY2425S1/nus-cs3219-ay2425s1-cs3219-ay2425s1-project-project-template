"use client";

import { Question } from "@/lib/schemas/question-schema";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableOfContentsIcon, Trash2Icon } from "lucide-react";

interface QuestionTableProps {
  data: Question[];
  isAdmin?: boolean;
  handleView: (question: Question) => void;
  handleDelete?: (question: Question) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ ...props }) => {
  const adminActions = (question: Question) => (
    <>
      <Button
        variant="destructive"
        className="ml-2"
        onClick={() => props.handleDelete && props.handleDelete(question)}
      >
        <Trash2Icon />
      </Button>
    </>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Complexity</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.map((question) => (
          <TableRow key={question.id}>
            <TableCell>{question.title}</TableCell>
            <TableCell>{question.category}</TableCell>
            <TableCell>{question.complexity}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                onClick={() => props.handleView(question)}
              >
                <TableOfContentsIcon />
              </Button>
              {props.isAdmin && adminActions(question)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default QuestionTable;
