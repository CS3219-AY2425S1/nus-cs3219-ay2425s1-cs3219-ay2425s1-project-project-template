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

interface Problem {
    title: string
    category: string[]
    difficulty: string
    status: boolean
}

export default function Problems(props: { problems: any }) {
    // const { problems } = props
    let problems: Problem[] = [
        { title: "Two Sum", category: ["Array", "Hash Table"], difficulty: "Easy", status: true },
        { title: "Add Two Numbers", category: ["Linked List", "Math"], difficulty: "Medium", status: false },
        { title: "Longest Substring Without Repeating Characters", category: ["String", "Sliding Window"], difficulty: "Medium", status: true },
        { title: "Median of Two Sorted Arrays", category: ["Array", "Binary Search"], difficulty: "Hard", status: false },
        { title: "Valid Parentheses", category: ["Stack", "String"], difficulty: "Easy", status: true }
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
                            <TableHead>Problem</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problems.map((problem: any, index: number) => (
                            <TableRow key={index} className="h-20"> {/* Increased height */}
                                <TableCell>{problem.title}</TableCell>
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
