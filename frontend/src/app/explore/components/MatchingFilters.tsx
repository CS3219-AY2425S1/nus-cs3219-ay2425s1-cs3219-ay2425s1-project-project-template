"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/multi-select";
import { Label } from '@/components/ui/label'

const formSchema = z.object({
    languages: z.array(z.string()).optional(),
    difficulties: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    problems: z.array(z.string()).optional(),
})

const MatchingFilters = () => {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            languages: [],
            difficulties: [],
            categories: [],
            problems: []
        },
    })

    const onSubmit = () => { }

    return (
        <div className="flex flex-col p-8 gap-4">
            <h1 className="text-2xl font-bold self-start text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-text-first)] via-[var(--gradient-text-second)] to-[var(--gradient-text-third)]">Look for peers to code now!</h1>
            <Form {...form}>
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
                        options={categoriesList}
                        onValueChange={setSelectedCategories}
                        defaultValue={selectedCategories}
                        placeholder="Select categories..."
                        maxCount={3}
                    />
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex justify-end w-full space-x-2">
                        <Button type="submit">Match now</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default MatchingFilters