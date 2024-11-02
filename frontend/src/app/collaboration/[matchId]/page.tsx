'use client';

import { FC, useEffect, useState } from 'react';
import { Question } from "@/types/question.types";
import { io, Socket } from "socket.io-client";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Ensure to import your Label component

interface CollaborationPageProps {
    params: {
        matchId: string;
    };
}

const CollaborationPage: FC<CollaborationPageProps> = ({ params }) => {
    const { matchId } = params;
    const [error, setError] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);

    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        const newSocket = io(process.env.NEXT_PUBLIC_COLLAB_API_URL);
        setSocket(newSocket);

        newSocket.emit('joinCollabSession', { matchId });

        newSocket.on("question", (data: Question) => {
            if (data) {
                setQuestion(data);
            } 
        });

        newSocket.on("newQuestionError", (data: { message: string; timestamp: string }) => {
            setError(data.message);
        });

        newSocket.on("collabError", (data: { message: string; timestamp: string }) => {
            setError(data.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [matchId]);

    const requestNewQuestion = (data: { topic: string; difficulty: string }) => {
        if (socket) {
            socket.emit('generateNewQuestion', {
                matchId: matchId,
                topic: data.topic,
                difficulty: data.difficulty
            });
            reset();
        }
    };

    return (
        <div>
            <h1>Collaboration Page</h1>
            {error && <p className="error">Error: {error}</p>}
            {question ? (
                <div>
                    <h2>{question.title}</h2>
                    <p>{question.description}</p>
                </div>
            ) : (
                <p>Loading question...</p>
            )}
            <form onSubmit={handleSubmit(requestNewQuestion)}>
                <div className="grid gap-4 p-4 pb-2">
                    <div className="grid gap-2">
                        <Label htmlFor="difficulty">Question Difficulty</Label>
                        <Controller
                            name="difficulty"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Question Topic</Label>
                        <Controller
                            name="topic"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="Strings">Strings</SelectItem>
                                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                                    <SelectItem value="Data Structures">Data Structures</SelectItem>
                                    <SelectItem value="Bit Manipulation">Bit Manipulation</SelectItem>
                                    <SelectItem value="Recursion">Recursion</SelectItem>
                                    <SelectItem value="Databases">Databases</SelectItem>
                                    <SelectItem value="Arrays">Arrays</SelectItem>
                                    <SelectItem value="Brainteaser">Brainteaser</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <Button type="submit">Request New Question</Button>
                </div>
            </form>
        </div>
    );
};

export default CollaborationPage;
