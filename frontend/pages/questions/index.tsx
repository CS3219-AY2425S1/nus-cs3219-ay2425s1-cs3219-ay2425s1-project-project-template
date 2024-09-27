'use client'

import { Payment, columns } from '@/components/questions/columns'
import { DataTable } from '@/components/questions/data-table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 2,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'easy',
        },
        {
            id: 3,
            email: 'm@example.com',
            category: 'Blgorithms',
            status: 'completed',
            description: 'This is a description',
            difficulty: 'hard',
        },
        {
            id: 4,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'This is a description',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'Test algbat',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'Appla tat',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'ZOogo a',
            difficulty: 'medium',
        },
        {
            id: 1,
            email: 'm@example.com',
            category: 'Algorithms',
            status: 'failed',
            description: 'Baga bia',
            difficulty: 'medium',
        },

        // ...
    ]
}

export default function Home() {
    const [data, setData] = useState<Payment[]>([])

    useEffect(() => {
        async function fetchData() {
            const result = await getData()
            setData(result)
        }
        fetchData()
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold my-6">Questions</h2>
                <Button className="mt-4 bg-purple-600 hover:bg-[#A78BFA]">Create</Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
