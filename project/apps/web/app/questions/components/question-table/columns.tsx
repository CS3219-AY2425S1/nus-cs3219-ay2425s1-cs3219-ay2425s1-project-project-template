// columns.tsx
import React from "react";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import DifficultyBadge from "@/components/DifficultyBadge";
import { CATEGORY, COMPLEXITY } from "@/constants/question";
import { QuestionDto } from "@repo/dtos/questions";

// Complexity sorting order
const complexityOrder: { [key in COMPLEXITY]: number } = {
  [COMPLEXITY.Easy]: 1,
  [COMPLEXITY.Medium]: 2,
  [COMPLEXITY.Hard]: 3,
};

// Sorting function for complexity
const complexitySortingFn: SortingFn<QuestionDto> = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId) as COMPLEXITY;
  const valueB = rowB.getValue(columnId) as COMPLEXITY;
  return complexityOrder[valueA] - complexityOrder[valueB];
};

// Filtering functions
const complexityFilter = (row: any, columnId: string, filterValue: string[]) => {
  return filterValue.length === 0 || filterValue.includes(row.getValue(columnId));
};

const categoryFilter = (row: any, columnId: string, filterValue: string[]) => {
  const rowValues = row.getValue(columnId) as string[];
  return (
    filterValue.length === 0 ||
    filterValue.some((value: string) => rowValues.includes(value))
  );
};

// Column definitions
export const columns: ColumnDef<QuestionDto>[] = [
  {
    accessorKey: "q_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link href={`/question/${row.original.id}`} className="text-blue-500 hover:text-blue-700">
        {row.original.q_title}
      </Link>
    ),
  },
  {
    accessorKey: "q_complexity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Difficulty
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <DifficultyBadge complexity={row.original.q_complexity} />,
    filterFn: complexityFilter,
    sortingFn: complexitySortingFn,
  },
  {
    accessorKey: "q_category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Categories
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2 max-w-md">
        {row.original.q_category.map((category) => (
          <Badge key={category} variant="secondary" className="mr-2">
            {category}
          </Badge>
        ))}
      </div>
    ),
    filterFn: categoryFilter,
  },
];