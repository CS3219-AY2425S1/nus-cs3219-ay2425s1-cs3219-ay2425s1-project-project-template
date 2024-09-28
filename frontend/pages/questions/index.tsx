'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Datatable from '@/components/customs/datatable'
import { Difficulty, IDatatableColumn, IPagination, IQuestion, ISortBy, QuestionStatus, SortDirection } from '@/types'
import { ExclamationIcon, TickIcon } from '@/assets/icons'
import { DifficultyLabel } from '@/components/customs/difficulty-label'

async function getData(): Promise<IQuestion[]> {
    return [
        {
            id: 1,
            category: ['Algorithms'],
            status: QuestionStatus.FAILED,
            description: 'This is a description',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 2,
            category: ['Algorithms'],
            status: QuestionStatus.FAILED,
            description: 'This is a description',
            difficulty: Difficulty.Easy,
            title: 'Title of the question',
        },
        {
            id: 3,
            category: ['Algorithms'],
            status: QuestionStatus.COMPLETED,
            description: 'This is a description',
            difficulty: Difficulty.Hard,
            title: 'Title of the question',
        },
        {
            id: 4,
            category: ['Algorithms'],
            status: QuestionStatus.NOT_ATTEMPTED,
            description: 'This is a description',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 5,
            category: ['Strings'],
            status: QuestionStatus.COMPLETED,
            description: 'This is a description',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 6,
            category: ['Algorithms'],
            status: QuestionStatus.COMPLETED,
            description: 'This is a description',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 7,
            category: ['Strings'],
            status: QuestionStatus.FAILED,
            description: 'This is a description',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 8,
            category: ['Algorithms'],
            status: QuestionStatus.FAILED,
            description:
                'This is some super super unnecessarily long description to test the overflow of the text in the datatable column. This is some super super unnecessarily long description to test the overflow of the text in the datatable column',
            difficulty: Difficulty.Medium,
            title: 'Another title of the question',
        },
        {
            id: 9,
            category: ['Algorithms, Strings'],
            status: QuestionStatus.NOT_ATTEMPTED,
            description: 'Test algbat',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 10,
            category: ['Algorithms'],
            status: QuestionStatus.FAILED,
            description: 'Appla tat',
            difficulty: Difficulty.Medium,
            title: 'Another title of the question',
        },
        {
            id: 11,
            category: ['Algorithms'],
            status: QuestionStatus.NOT_ATTEMPTED,
            description: 'ZOogo a',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },
        {
            id: 12,
            category: ['Algorithms'],
            status: QuestionStatus.COMPLETED,
            description: 'Baga bia',
            difficulty: Difficulty.Medium,
            title: 'Title of the question',
        },

        // ...
    ]
}

const columns: IDatatableColumn[] = [
    {
        key: 'id',
        isHidden: true,
    },
    {
        key: 'category',
    },
    {
        key: 'description',
        maxWidth: '45%',
        formatter: (value) => {
            return (
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {value}
                </div>
            )
        },
    },
    {
        key: 'status',
        formatter: (value) => {
            return (
                <div className="flex items-center justify-center">
                    {value === QuestionStatus.COMPLETED ? (
                        <TickIcon />
                    ) : value === QuestionStatus.FAILED ? (
                        <ExclamationIcon />
                    ) : null}
                </div>
            )
        },
    },
    {
        key: 'difficulty',
        isSortable: true,
        formatter: (value) => {
            return <DifficultyLabel difficulty={value} />
        },
    },
]

export default function Questions() {
    const [data, setData] = useState<IQuestion[]>([])
    const [pagination, setPagination] = useState<IPagination>({
        totalPages: 10,
        currentPage: 1,
        totalItems: 96,
        limit: 10,
    })
    const [sortBy, setSortBy] = useState({
        sortKey: 'id',
        direction: SortDirection.NONE,
    })

    const sortHandler = (sortBy: ISortBy) => {
        console.log(sortBy)
        setSortBy(sortBy)
    }

    const paginationHandler = (page?: number, limit?: number) => {
        console.log(page, limit)
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [])

    return (
        <div className="m-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold my-6">Questions</h2>
                <Button className="bg-purple-600 hover:bg-[#A78BFA]">Create</Button>
            </div>
            <Datatable
                data={data}
                columns={columns}
                pagination={pagination}
                sortBy={sortBy}
                sortHandler={sortHandler}
                paginationHandler={paginationHandler}
            />
        </div>
    )
}
