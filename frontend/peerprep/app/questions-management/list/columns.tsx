"use client";
import BoxIcon from "@/components/boxicons";
import { Button, Chip } from "@nextui-org/react";

export type Question = {
  _id: string;
  title: string;
  category: string[];
  complexity: string;
  question_id: number;
};

export const columns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "complexity",
    label: "Complexity",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const complexityColorMap: Record<string, "success" | "warning" | "danger"> = {
  Easy: "success",
  Medium: "warning",
  Hard: "danger",
};

export const complexityOptions = ["Easy", "Medium", "Hard"];

export let categoryOptions: string[] = [];

export const setCategoryOptions = (newOptions: string[]) => {
  categoryOptions = newOptions;
};

export function renderCell(
  question: Question,
  columnKey: React.Key,
  handleDelete: (question: Question) => void
) {
  const cellValue = question[columnKey as keyof Question];

  switch (columnKey) {
    case "title":
      return <span className="text-sm">{cellValue}</span>;
    case "complexity":
      return (
        <Chip
          className="capitalize"
          color={
            complexityColorMap[cellValue as keyof typeof complexityColorMap]
          }
          size="sm"
          variant="flat"
        >
          {cellValue}
        </Chip>
      );
    case "category":
      return (
        <div className="flex space-x-2">
          {question.category.map((cat) => (
            <Chip key={cat} className="capitalize" size="sm" variant="flat">
              {cat}
            </Chip>
          ))}
        </div>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-4">
          <Button
            radius="full"
            isIconOnly
            variant="light"
            className="cursor-pointer text-lg text-default-400 active:opacity-50"
            onPress={() => alert(`Opening item ${question._id}...`)}
          >
            <BoxIcon name="bxs-edit" />
          </Button>
          <Button
            radius="full"
            isIconOnly
            variant="light"
            className="cursor-pointer text-lg text-danger active:opacity-50"
            onPress={() => handleDelete(question)}
          >
            <BoxIcon name="bxs-trash" />
          </Button>
        </div>
      );
    default:
      return cellValue;
  }
}
