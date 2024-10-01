"use client";

import { useState } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { QuestionDto, CreateQuestionDto } from "@repo/dtos/questions";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CreateModal from "./components/CreateModal";
import { toast } from "@/hooks/use-toast";
import { createQuestion, fetchQuestions } from "@/lib/api/question";
import Link from "next/link";
import DifficultyBadge from "@/components/DifficultyBadge";
import EmptyPlaceholder from "./components/EmptyPlaceholder";
import { CATEGORY, COMPLEXITY } from "@/constants/question";
import { MultiSelect } from "@/components/multi-select";
import {
  ColumnDef,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/constants/queryKeys";

export default function QuestionRepositoryContent() {
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
      toast({
        variant: "success",
        title: "Success",
        description: "Question created successfully",
      });
    },
    onSettled: () => setConfirmLoading(false),
    onError: (error) => {
      console.error("Error creating question:", error);
      toast({
        variant: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleCreateQuestion = (newQuestion: CreateQuestionDto) => {
    createMutation.mutate(newQuestion);
  };

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const categoryOptions = [
    { value: CATEGORY.DataStructures, label: "Data Structures" },
    { value: CATEGORY.Algorithms, label: "Algorithms" },
    { value: CATEGORY.BrainTeaser, label: "Brain Teaser" },
    { value: CATEGORY.Strings, label: "Strings" },
    { value: CATEGORY.Databases, label: "Databases" },
    { value: CATEGORY.BitManipulation, label: "Bit Manipulation" },
    { value: CATEGORY.Arrays, label: "Arrays" },
    { value: CATEGORY.Recursion, label: "Recursion" },
  ];
  const complexityOrder: { [key in COMPLEXITY]: number } = {
    [COMPLEXITY.Easy]: 1,
    [COMPLEXITY.Medium]: 2,
    [COMPLEXITY.Hard]: 3,
  };
  
  // To sort the questions by complexity level
  const complexitySortingFn: SortingFn<QuestionDto> = (rowA, rowB, columnId) => {
    const valueA = rowA.getValue(columnId) as COMPLEXITY;
    const valueB = rowB.getValue(columnId) as COMPLEXITY;

    return complexityOrder[valueA] - complexityOrder[valueB];
  };

  // Define columns with filtering and sorting
  const complexityFilter = (row: any, columnId: string, filterValue: string[]) => { //TODO: row : any
    return filterValue.length === 0 || filterValue.includes(row.getValue(columnId));
  };

  const categoryFilter = (row : any, columnId : string, filterValue : string[]) => {
    const rowValues = row.getValue(columnId) as string[];
    return (
      filterValue.length === 0 ||
      filterValue.some((value: string) => rowValues.includes(value))
    );
  };

  const columns: ColumnDef<QuestionDto>[] = [
    {
      accessorKey: "q_title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link
          href={`/question/${row.original.id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          {row.original.q_title}
        </Link>
      ),
    },
    {
      accessorKey: "q_complexity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Difficulty
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <DifficultyBadge complexity={row.original.q_complexity} />
      ),
      filterFn: complexityFilter,
      sortingFn: complexitySortingFn,
    },
    {
      accessorKey: "q_category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categories
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
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

      {/* Filters */}
      <div className="flex gap-4 my-4">
        {/* Difficulty Filter */}
        <div className="w-64">
          <h2 className="font-semibold mb-2">Filter by Difficulty</h2>
          <MultiSelect
            options={[
              { value: COMPLEXITY.Easy, label: "Easy" },
              { value: COMPLEXITY.Medium, label: "Medium" },
              { value: COMPLEXITY.Hard, label: "Hard" },
            ]}
            onValueChange={(values) => {
              table.getColumn("q_complexity")?.setFilterValue(values);
            }}
            placeholder="Select Difficulty"
          />
        </div>

        {/* Category Filter */}
        <div className="w-64">
          <h2 className="font-semibold mb-2">Filter by Categories</h2>
          <MultiSelect
            options={categoryOptions}
            onValueChange={(values) => {
              table.getColumn("q_category")?.setFilterValue(values);
            }}
            placeholder="Select Category"
          />
        </div>
      </div>

      {/* Table */}
      {data?.length === 0 ? (
        <EmptyPlaceholder />
      ) : (
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              className={`${confirmLoading ? "opacity-50" : "opacity-100"}`}
            >
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total questions: {data?.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <CreateModal
        open={isCreateModalOpen}
        setOpen={setCreateModalOpen}
        onCreate={handleCreateQuestion}
      />
    </div>
  );
}
