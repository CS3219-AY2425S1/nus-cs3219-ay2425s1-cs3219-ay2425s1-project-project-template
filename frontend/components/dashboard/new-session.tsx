'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import React from 'react'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { useSession } from 'next-auth/react'
import { addUserToMatchmaking } from '@/services/matching-service-api'
import { toast } from 'sonner'

export const NewSession = () => {
    const TopicOptions = Object.values(Category).map((category) => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.toLocaleLowerCase().slice(1),
    }))

    const DifficultyOptions = Object.values(Complexity).map((difficulty) => ({
        value: difficulty,
        label: difficulty.charAt(0).toUpperCase() + difficulty.toLocaleLowerCase().slice(1),
    }))

    const { data: session } = useSession()

    const [selectedTopic, setSelectedTopic] = React.useState('')
    const [selectedDifficulty, setSelectedDifficulty] = React.useState('')

    const handleMatchmaking = async () => {
        if (!selectedTopic || !selectedDifficulty) {
            toast.error('Please select a topic and difficulty level to start matchmaking.')
        }

        try {
            await addUserToMatchmaking({
                userId: session?.user.id ?? '',
                proficiency: session?.user.proficiency as Proficiency,
                difficulty: selectedDifficulty as Complexity,
                topic: selectedTopic as Category,
            })
            // TODO: Add Modal logic here
            toast.success('Successfully added to the matchmaking queue.')
        } catch (error) {
            toast.error('Failed to add to matchmaking queue. Please try again later.')
        }
    }

    return (
        <div className="border-solid border-2 border-gray-200 rounded flex flex-col w-dashboard p-6 min-h-[60vh] max-h-[90vh] overflow-auto justify-between">
            <div>
                <h5 className=" text-xl text-medium font-bold">Start a New Session</h5>
                <br />
                <p className="text-medium font-medium mb-1">
                    Choose a <strong>Topic</strong> and <strong>Difficulty</strong> level to start your collaborative
                    coding session!
                </p>

                <p className="text-medium font-bold mt-6 mb-2">Topic</p>
                <Select onValueChange={(val: string) => setSelectedTopic(val as Category)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TopicOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <p className="text-medium font-bold mt-6 mb-2">Difficulty</p>
                <Select onValueChange={(val: string) => setSelectedDifficulty(val as Complexity)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent>
                        {DifficultyOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button className="mt-4 bg-purple-600 hover:bg-[#A78BFA]" onClick={handleMatchmaking}>
                Start matchmaking
            </Button>
        </div>
    )
}
