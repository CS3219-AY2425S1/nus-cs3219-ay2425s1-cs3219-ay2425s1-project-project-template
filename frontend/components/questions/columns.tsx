"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckCheckIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { CaretSortIcon, CrossCircledIcon } from "@radix-ui/react-icons"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: number
  email: string
  category: string
  description: string
  status: "failed" | "completed" 
  difficulty: "easy" | "medium" | "hard"
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            #
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button></div>)},    cell: ({ cell }) => {
        return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
      },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            EMAIL
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button></div>)},
    cell: ({ cell }) => {
        return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
      },
  },
    {
    accessorKey: "category",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            CATEGORY
            <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button></div>)},
    cell: ({ cell }) => {
        return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
      },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            DESCRIPTION
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button></div>)},    cell: ({ cell }) => {
        return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
      },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            STATUS
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button></div>)},    cell: ({ cell }) => {
        return <div className="flex justify-center items-center">{cell.getValue() === "failed" ? <CrossCircledIcon className='h-4 w-4 text-red-600' /> : <CheckCheckIcon className='h-4 w-4 text-green-500' />}</div>
      },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => {
        return (
            <div className='flex justify-center'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
          >
            DIFFICULTY
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button></div>)},    cell: ({ cell }) => {
        return <div className="text-center">
            <Badge>{cell.getValue() as React.ReactNode}</Badge>
        </div>
      },
  },
]
