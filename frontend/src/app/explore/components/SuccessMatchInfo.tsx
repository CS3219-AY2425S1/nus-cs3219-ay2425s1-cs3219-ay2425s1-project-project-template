import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress"

interface SuccessMatchInfoProps {
    isOpen: boolean;
    match: {
        user: string;
        question: string;
        language: string;
        difficulty: string;
        categories: string[];
    },
    onOpenChange: (isOpen: boolean) => void;
    handleAccept: () => void;

}

const SuccessMatchInfo = (props: SuccessMatchInfoProps) => {
    const { isOpen, match, onOpenChange, handleAccept } = props;
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
                                <h4 className="text-lg font-semibold">{match.user}</h4>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm mb-2">Question:</p>
                        <div>
                            <h4 className="text-lg font-semibold">{match.question}</h4>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-sm mb-2">Difficulty:</h5>
                        <div>
                            <h4 className="text-lg font-semibold">{match.difficulty}</h4>
                        </div>
                    </div>
                    <div>
                        <h5 className="text-sm mb-2">Categories:</h5>
                        <div className="flex flex-wrap gap-2">
                            {match.categories.map((categories, index) => (
                                <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                                    {categories}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAccept}>Accept</Button>
                </DialogFooter>
                <Progress className='bg-white ' value={35} />
            </DialogContent>
        </Dialog>
    )
}

export default SuccessMatchInfo