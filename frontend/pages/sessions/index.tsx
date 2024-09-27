'use client'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { EasyBadge, HardBadge, MediumBadge } from '@/components/ui/difficult-badge'
import SortIcon from '@/components/ui/sort-icon'
import { CrossStatusIcon, TickStatusIcon } from '@/components/ui/status-icon'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { useEffect, useState } from 'react'

interface Session {
    id: number
    name: string
    email: string
    question: string
    description: string
    status: 'failed' | 'completed'
    difficulty: 'easy' | 'medium' | 'hard'
    time: number
}

export const columns: ColumnDef<Session>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
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
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">NAME</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell, row }) => {
            return (
                <div>
                    <div>{cell.getValue() as React.ReactNode}</div>
                    <div className="text-gray-500 text-xs">{row.original.email}</div>
                </div>
            )
        },
    },
    {
        accessorKey: 'question',
        header: () => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        QUESTION
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
        header: () => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
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
                        variant="ghost"
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
                        variant="ghost"
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
    {
        accessorKey: 'time',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={column.getToggleSortingHandler()}
                        className="text-slate-[#464F60] text-[11px] font-semibold flex items-center"
                    >
                        <span className="mr-2">TIME</span>
                        <SortIcon sortDir={column.getIsSorted()} />
                    </Button>
                </div>
            )
        },
        cell: ({ cell }) => {
            return (
                <div className="text-center">
                    <div>{moment(cell.getValue() as number).format('Do MMMM YYYY')}</div>
                    <div>{moment(cell.getValue() as number).format('HH:mm')}</div>
                </div>
            )
        },
    },
]

async function getData(): Promise<Session[]> {
    // Fetch data from your API here.
    return [
        {
            id: 1,
            name: 'Olivian Martin',
            email: 'olvia.martin@email.com',
            question: 'reverse a string',
            description: 'reverse the given string, returning the chracters in reverse order',
            status: 'failed',
            difficulty: 'easy',
            time: 1727445395396,
        },
        {
            id: 2,
            name: 'Billy Russo',
            email: 'billy.russo@email.com',
            question: 'reverse a string',
            description: 'reverse the given string, returning the chracters in reverse order',
            status: 'completed',
            difficulty: 'medium',
            time: 1727745397396,
        },
        {
            id: 1,
            name: 'Charlie munger',
            email: 'charlie.mnunger@email.com',
            question: 'reverse a string',
            description: 'reverse the given string, returning the chracters in reverse order',
            status: 'failed',
            difficulty: 'hard',
            time: 1797445395396,
        },
    ]
}

export default function Sessions() {
    const [data, setData] = useState<Session[]>([])

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [])

    return (
        <div>
            <h2 className="text-xl font-bold my-6">Sessions</h2>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
