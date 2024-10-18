"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/components/multi-select";
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/spinner'

const MatchingFilters = () => {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSearching) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [isSearching])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    const languagesList = [
        { label: "Python", value: "Python" },
        { label: "JavaScript", value: "JavaScript" },
        { label: "Java", value: "Java" },
        { label: "C++", value: "C++" },
        { label: "C#", value: "C#" },
        { label: "Ruby", value: "Ruby" },
        { label: "Go", value: "Go" },
        { label: "Kotlin", value: "Kotlin" },
        { label: "Swift", value: "Swift" },
        { label: "TypeScript", value: "TypeScript" },
    ]
    const categoriesList = [
        { label: "Strings", value: "Strings" },
        { label: "Algorithms", value: "Algorithms" },
        { label: "Data Structures", value: "Data Structures" },
        { label: "Bit Manipulation", value: "Bit Manipulation" },
        { label: "Recursion", value: "Recursion" },
        { label: "Databases", value: "Databases" },
        { label: "Arrays", value: "Arrays" },
        { label: "Brainteaser", value: "Brainteaser" },
    ]
    const difficultyList = [
        { label: "Easy", value: "Easy" },
        { label: "Medium", value: "Medium" },
        { label: "Hard", value: "Hard" },
    ]
    const questionsList = [
        { label: "Question 1", value: "Question 1" },
        { label: "Question 2", value: "Question 2" },
        { label: "Question 3", value: "Question 3" },
        { label: "Question 4", value: "Question 4" },
        { label: "Question 5", value: "Question 5" },
        { label: "Question 6", value: "Question 6" },
        { label: "Question 7", value: "Question 7" },
        { label: "Question 8", value: "Question 8" },
        { label: "Question 9", value: "Question 9" },
        { label: "Question 10", value: "Question 10" },
    ]

    const onSearchPress = () => {
        setIsSearching(!isSearching);
    }

    return (
        <div className="flex flex-col p-8 gap-4">
            <h1 className="text-2xl font-bold self-start text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-text-first)] via-[var(--gradient-text-second)] to-[var(--gradient-text-third)]">Look for peers to code now!</h1>
            <div className='flex gap-6'>
                <div className='w-1/3'>
                    <Label>Language</Label>
                    <MultiSelect
                        options={languagesList}
                        onValueChange={setSelectedLanguages}
                        defaultValue={selectedLanguages}
                        placeholder="Select language..."
                        maxCount={3}
                    />
                </div>
                <div className='w-1/3'>
                    <Label>Difficulty</Label>
                    <MultiSelect
                        options={difficultyList}
                        onValueChange={setSelectedDifficulty}
                        defaultValue={selectedDifficulty}
                        placeholder="Select difficulty..."
                        maxCount={3}
                    />
                </div>
                <div className='w-1/3'>
                    <Label>Categories</Label>
                    <MultiSelect
                        options={categoriesList}
                        onValueChange={setSelectedCategories}
                        defaultValue={selectedCategories}
                        placeholder="Select categories..."
                        maxCount={3}
                    />
                </div>
            </div>
            <div>
                <Label>Selected Questions</Label>
                <MultiSelect
                    options={questionsList}
                    onValueChange={setSelectedQuestions}
                    defaultValue={selectedQuestions}
                    placeholder="Select categories..."
                    maxCount={3}
                />
            </div>
            <div className="flex justify-end w-full space-x-2 mt-4">
                <Button variant={isSearching ? "destructive" : "default"} onClick={onSearchPress}>
                    {isSearching ? (
                        <>
                            <Spinner size='small' className="size-small mr-2" />
                            <span>{formatTime(elapsedTime)}</span>
                        </>
                    ) : (
                        "Match Now"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default MatchingFilters