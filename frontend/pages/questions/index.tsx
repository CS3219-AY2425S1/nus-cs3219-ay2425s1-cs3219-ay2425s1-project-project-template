'use client'

import { Payment, columns } from "@/components/questions/columns"
import { DataTable } from '@/components/questions/data-table'
import { useEffect, useState } from 'react';

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Blgorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },
          {
            id: 1,
            email: "m@example.com",
            category: "Algorithms",
            status: "failed",
            description: "This is a description",
            difficulty: "medium"
          },

 
      // ...
    ]
  }

export default function Home() {
    const [data, setData] = useState<Payment[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getData();
            setData(result);
        }
        fetchData();
    }, []);

    return (
        <div>
        <h2 className="text-xl font-bold my-6">
            Questions
        </h2>
        <DataTable  columns={columns} data={data} />
        </div>
    )
}
