'use client'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import CompletedIcon from '@mui/icons-material/TaskAlt';
import { useEffect, useState } from "react";

interface Problem {
    id: number
    title: string
    description: string
    category: string[]
    difficulty: string
    status: boolean
}

export default function Problems(props: { problems: any }) {
    const [questions, setQuestions] = useState([])
  
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5001/get-questions')
        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }
        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        console.log("Error", err)
      }
    }
  
    useEffect(() => {
      fetchQuestions()
    }, [])

    // const { problems } = props
    let problems: Problem[] = [
        { id: 1, title: "Two Sum", description: "Find two numbers that add up to a target value.", category: ["Array", "Hash Table"], difficulty: "Easy", status: true },
        { id: 2, title: "Add Two Numbers", description: "Add two numbers represented by linked lists.", category: ["Linked List", "Math"], difficulty: "Medium", status: false },
        { id: 3, title: "Longest Substring Without Repeating Characters", description: "Find the longest substring without repeating characters.", category: ["String", "Sliding Window"], difficulty: "Medium", status: true },
        { id: 4, title: "Median of Two Sorted Arrays", description: "Find the median of two sorted arrays.", category: ["Array", "Binary Search"], difficulty: "Hard", status: false },
        { id: 5, title: "Valid Parentheses", description: "Check if the parentheses are valid.", category: ["Stack", "String"], difficulty: "Easy", status: true }
    ]
    return (
        <section className="flex h-full justify-center mt-14">
            <div className="flex-col h-full py-12 w-5/6 2xl:w-3/5">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl 2xl:text-4xl font-bold text-black text-start">
                        Problems
                    </h1>
                    <Button>Create a new problem</Button>
                </div>
                <div className="my-12">
                    {/* Search */}
                    {/* Filter */}
                </div>
                <Table className="table-auto">
                    <TableCaption>A list of coding problems</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Id</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problems.map((problem: any, index: number) => (
                            <TableRow key={index} className="h-20"> {/* Increased height */}
                                <TableCell>{problem.id}</TableCell>
                                <TableCell>{problem.title}</TableCell>
                                <TableCell>{problem.description}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                        {problem.category.map((c: string) => (
                                            <Badge variant="category" key={c}>{c}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge></TableCell>
                                <TableCell>
                                    {problem.status && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <CompletedIcon sx={{ color: 'var(--color-completed-hover)' }} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Solved</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}
