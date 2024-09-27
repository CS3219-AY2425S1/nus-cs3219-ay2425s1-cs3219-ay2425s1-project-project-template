'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { CrossStatusIcon, TickStatusIcon } from '../ui/status-icon'
import { EasyBadge, HardBadge, MediumBadge } from '../ui/difficult-badge'
import SortIcon from '../ui/sort-icon'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Question = {
    id: number
    email: string
    category: string
    description: string
    status: 'failed' | 'completed'
    difficulty: 'easy' | 'medium' | 'hard'
}

export const columns: ColumnDef<Question>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">#</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">EMAIL</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
        },
    },
    {
        accessorKey: 'category',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">CATEGORY</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
        },
    },
    {
        accessorKey: 'description',
        sortingFn: 'alphanumeric',
        header: () => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        DESCRIPTION
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return <div className="text-center">{cell.getValue() as React.ReactNode}</div>
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">STATUS</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return (
                <div className="flex justify-center items-center">
                    {cell.getValue() === 'failed' ? <CrossStatusIcon /> : <TickStatusIcon />}
                </div>
            )
        },
    },
    {
        accessorKey: 'difficulty',
        sortingFn: (rowA, rowB) => {
            if (rowA.original.difficulty === rowB.original.difficulty) {
                return 0
            }
            if (rowA.original.difficulty === 'easy') {
                return 1
            }
            if (rowB.original.difficulty === 'easy') {
                return -1
            }
            if (rowA.original.difficulty === 'medium') {
                return 1
            }
            if (rowB.original.difficulty === 'medium') {
                return -1
            }
            if (rowA.original.difficulty === 'hard') {
                return 0
            }
            return 0
        },
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghostTab"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">DIFFICULTY</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return (
                <div className="flex justify-center items-center">
                    {cell.getValue() === 'easy' ? (
                        <EasyBadge />
                    ) : cell.getValue() === 'medium' ? (
                        <MediumBadge />
                    ) : (
                        <HardBadge />
                    )}
                </div>
            )
        },
    },
]
