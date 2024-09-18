'use client'

import { NavBar } from '@/components/navbar'
import { NewSession } from '@/components/dashboard/new-session'
import { ProgressCard } from '@/components/dashboard/progress-card'
import { RecentSessions } from '@/components/dashboard/recent-sessions'

export default function Home() {
    const progressData = [
        {
            difficulty: 'Easy',
            score: '10/20',
            progress: 50,
            indicatorColor: 'bg-green-700',
            backgroundColor: 'bg-green-500',
        },
        {
            difficulty: 'Medium',
            score: '15/27',
            progress: 60,
            indicatorColor: 'bg-amber-500',
            backgroundColor: 'bg-amber-300',
        },
        {
            difficulty: 'Hard',
            score: '5/19',
            progress: 20,
            indicatorColor: 'bg-red-500',
            backgroundColor: 'bg-red-400',
        },
    ]

    return (
        <div>
            <NavBar />
            <div className="mx-8 my-4">
                <h2 className="text-xl font-bold my-6 mx-2">Welcome Back, Lynn</h2>
                <div className="flex flex-row justify-evenly">
                    {progressData.map(({ difficulty, score, progress, indicatorColor, backgroundColor }, index) => (
                        <ProgressCard
                            key={index}
                            difficulty={difficulty}
                            score={score}
                            progress={progress}
                            indicatorColor={indicatorColor}
                            backgroundColor={backgroundColor}
                        />
                    ))}
                </div>
                <div className="flex flex-row justify-between my-4 mx-2">
                    <NewSession />
                    <RecentSessions />
                </div>
            </div>
        </div>
    )
}
