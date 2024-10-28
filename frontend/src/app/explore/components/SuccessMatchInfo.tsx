import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label";

interface SuccessMatchInfoProps {
    isOpen: boolean;
    match: {
        matchId: string;
        partner: {
            userId: string;
            userName: string;
        };
        question: {
            questionId: number;
            title: string;
            difficulty: string;
            categories: string[];
        };
        isWaiting?: boolean;
    };
    onOpenChange: (isOpen: boolean) => void;
    handleAccept: (matchId: string) => void;
}

const SuccessMatchInfo = (props: SuccessMatchInfoProps) => {
    const { isOpen, match, onOpenChange, handleAccept } = props;
    const [timerProgress, setTimerProgress] = useState(0); // Progress from 0 to 100
    const [isAcceptDisabled, setIsAcceptDisabled] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        console.log('SuccessMatchInfo match object:', match);

        if (isOpen) {
            const totalDuration = 15000; // 15 seconds in milliseconds
            const updateInterval = 100; // Update every 100 milliseconds
            const increment = (100 / totalDuration) * updateInterval; // Calculate how much to increment each time

            timer = setInterval(() => {
                setTimerProgress((prev) => {
                    const newProgress = prev + increment;
                    if (newProgress >= 100) {
                        if (timer) clearInterval(timer);
                        setTimerProgress(100);
                        setIsAcceptDisabled(true); // Disable the Accept button
                        return 100;
                    }
                    return newProgress;
                });
            }, updateInterval);
        }

        return () => {
            if (timer) clearInterval(timer);
            setTimerProgress(0); // Reset progress when the component unmounts or dialog closes
            setIsAcceptDisabled(false);
        };
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#8A63D2] via-[#5932C3] to-[#2A185D] text-white border-none rounded-xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className='mt-10 flex justify-center'>
                        <h1 className='text-2xl'>Match Found!</h1>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 p-2">
                    <div>
                        <p className="text-sm mb-2">Partner:</p>
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-secondary p-2">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold">{match.partner.userName}</h4>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm mb-2">Question:</p>
                        <div>
                            <h4 className="text-lg font-semibold">{match.question.questionId}. {match.question.title}</h4>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-sm mb-2">Difficulty:</h5>
                        <div>
                            <h4 className="text-lg font-semibold">{match.question.difficulty}</h4>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-sm mb-2">Categories:</h5>
                        <div className="flex flex-wrap gap-2">
                            {match.question.categories.map((category, index) => (
                                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                    {match.isWaiting && (
                        <div className="mt-4">
                            <Label className="text-yellow-500">Waiting for your partner to accept...</Label>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => handleAccept(match.matchId)} disabled={isAcceptDisabled}>Accept</Button>
                </DialogFooter>
                <Progress className='bg-white ' value={timerProgress} />
                {isAcceptDisabled && <Label>You did not accept the match in time.</Label>}
            </DialogContent>
        </Dialog>
    )
}

export default SuccessMatchInfo
