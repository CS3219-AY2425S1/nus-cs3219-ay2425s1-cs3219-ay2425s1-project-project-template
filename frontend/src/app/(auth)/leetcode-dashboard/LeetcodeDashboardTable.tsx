"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { HiOutlinePencil } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import { getLeetcodeDashboardData } from "@/api/leetcode-dashboard";
import { QuestionMinified } from "@/types/find-match";

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

export const columns: ColumnDef<QuestionMinified>[] = [
  {
    accessorKey: "questionid",
    header: () => <Cell>ID</Cell>,
    cell: ({ row }) => (
      <Cell className="capitalize">{row.getValue("questionid")}</Cell>
    ),
  },
  {
    accessorKey: "title",
    header: () => <Cell>Question Title</Cell>,
    cell: ({ row }) => <Cell>{row.getValue("title")}</Cell>,
  },
  {
    accessorKey: "complexity",
    header: () => <Cell>Difficulty</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("complexity")}</Cell>;
    },
  },
  {
    accessorKey: "category",
    header: () => <Cell>Topics</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("category")}</Cell>;
    },
  },
  {
    accessorKey: "actions",
    header: () => <Cell>Actions</Cell>,
    cell: ({}) => {
      return (
        <Cell>
          <Button variant={"ghost"}>
            <HiOutlinePencil />
          </Button>
          <Button variant={"ghost"}>
            <FaRegTrashAlt />
          </Button>
        </Cell>
      );
    },
  },
];

export function LeetcodeDashboardTable() {
  const [data, setData] = React.useState<QuestionMinified[]>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    getLeetcodeDashboardData().then((data) => setData(data));
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full test">
      <div>
        <Table className="font-light">
          <TableHeader className="w-full">
            <TableRow className="text-white bg-primary-900 font-medium hover:bg-transparent h-[5rem] text-md">
              <TableCell colSpan={5} className="pl-10">
                Past Collaborations
              </TableCell>
            </TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="text-primary-400 bg-primary-800 text-xs hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-primary-900 text-primary-300 text-xs">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      <div className="flex items-center justify-end space-x-2 py-4 bg-primary-800 rounded-b-lg">
        <div className="space-x-2 flex justify-around items-center w-full text-primary-300">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <div>
            Page {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </div>
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
    </div>
  );
}
