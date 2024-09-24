"use client"
import * as React from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    rowCount: data.length
  })

  return (
    <div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
               className={row.index % 2 == 0 ? 'bg-gray-50' : ''}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className='flex justify-between items-center'>
        <div className='text-sm italic text-gray-600'>
            {(table.getState().pagination.pageIndex) * table.getState().pagination.pageSize + 1} - {Math.min(data.length, (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize)} of {data.length}
        </div>
    
    <div className="flex items-center justify-end space-x-2 py-4">
        
        <DropdownMenu>
  <DropdownMenuTrigger><div className='text-sm flex'>Rows per page: {table.getState().pagination.pageSize} <CaretDownIcon className='cursor-pointer h-4 w-4' /></div></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => table.setPageSize(1)}>1</DropdownMenuItem>
    <DropdownMenuItem onClick={() => table.setPageSize(2)}>2</DropdownMenuItem>
    <DropdownMenuItem onClick={() => table.setPageSize(5)}>5</DropdownMenuItem>
    <DropdownMenuItem onClick={() => table.setPageSize(10)}>10</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        <Button
          variant="outline"
          size={null}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <CaretLeftIcon className="h-4 w-4" /> 
        </Button>
        <div className='text-xs'>
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size={null}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <CaretRightIcon   className="h-4 w-4" />
        </Button>
      </div>
    </div>
    </div>

  )
}
