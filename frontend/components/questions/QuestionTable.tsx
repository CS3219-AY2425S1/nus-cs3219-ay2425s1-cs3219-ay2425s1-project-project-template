import { useCallback } from "react";
import { Key as ReactKey } from "react";

import { Question } from "@/types/questions";

import { Button } from "@nextui-org/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@nextui-org/table";

import CategoryTags from "./CategoryTags"; 
import DifficultyTags from "./DifficultyTags";
import ActionButtons from "./ActionButtons";

interface QuestionTableProps {
    questions: Question[]
}

const columns = [
    { name: 'Id', uid: 'questionId' },
    { name: 'Title', uid: 'title' },
    { name: 'Category', uid: 'category' },
    { name: 'Difficulty', uid: 'complexity' },
    { name: 'Action', uid: 'action'}
]

export default function QuestionTable({ questions }: QuestionTableProps) {
    const renderCell = useCallback(
        (question: Question, columnKey: ReactKey) => {
            const questionValue = question[columnKey as keyof Question];

            switch (columnKey) {
                case "title": {
                    const titleString: string = questionValue as string;
                    return (
                        <h2 className='capitalize'>
                            { titleString }
                        </h2>
                    )
                }
                case "category": {
                    const categoryString: string = questionValue as string;
                    const categories = categoryString.split(',');
                    return (
                        <CategoryTags questionId={question.questionId} categories={categories} />
                    )
                }
                case "complexity": {
                    return (
                        <DifficultyTags difficulty={ questionValue as string }/>
                    )
                }
                case "action": {
                    return (
                        <ActionButtons question={question}/>
                    )
                }
                default: {
                    return (
                        <h2>{ questionValue }</h2>
                    )
                }
            }
        }, []
    );
    return (
        <div className="flex relative flex-col items-center w-9/12">
            <div className='flex w-full justify-between'>
                <h2>
                Questions
                </h2>
                <Button>
                Add
                </Button>
            </div>
            <div className='mt-5 h-52 w-full'>
            <Table aria-label="Example empty table">
                <TableHeader columns={columns}>
                    {
                        column => {
                            return (
                                <TableColumn key={column.uid} align={column.uid === 'action' ? 'center' : 'start'}>
                                    { column.name }
                                </TableColumn>
                            )
                        }
                    }
                </TableHeader>
                <TableBody items={questions}>
                    {(item) => (
                        <TableRow key={item.questionId}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </div>
    );
}



