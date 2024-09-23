import { DifficultyLabel } from '@/components/customs/difficulty-label'
import { Button } from '@/components/ui/button'
import CustomLabel from '@/components/ui/label'
import { Difficulty } from '@/tyoes/difficulty'
import Image from 'next/image'

interface ICollaborator {
    name: string
    email: string
}

interface IQuestion {
    title: string
    description: string
    difficulty: Difficulty
    category: string[]
}

const collaboratorData: ICollaborator = {
    name: 'John Doe',
    email: 'johnnydoey@gmail.com',
}

const userData: ICollaborator = {
    name: 'Oliver Wye',
    email: 'oliverwye@gmail.com',
}

const chatData = [
    {
        user: userData,
        message: "I don't understand the question. Please help me!",
        timestamp: '2024-09-20T11:59:00',
    },
    {
        user: collaboratorData,
        message: 'Hey, lets try to solve this together.',
        timestamp: '2024-09-20T12:01:00',
    },
    {
        user: userData,
        message: 'Okay! I am ready',
        timestamp: '2024-09-20T12:03:00',
    },
    {
        user: collaboratorData,
        message: 'Sure, lets start by understanding the question',
        timestamp: '2024-09-20T12:05:00',
    },
    {
        user: collaboratorData,
        message: 'This question is about reversing a string',
        timestamp: '2024-09-20T12:08:00',
    },
    {
        user: userData,
        message: 'What does reverse mean?',
        timestamp: '2024-09-20T12:09:00',
    },
]

const questionData: IQuestion = {
    title: 'Reverse a String',
    description:
        'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. Example 1: Input: s =["h", "e", "l", "l", "o"] Output: ["o", "l", "l", "e", "h"]',
    difficulty: Difficulty.Easy,
    category: ['Array', 'Hash Table'],
}

const formatQuestionCategories = (cat: string[]) => {
    return cat.join(', ')
}

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
}

const getChatBubbleFormat = (currUser: ICollaborator, type: 'label' | 'text') => {
    let format = ''
    if (currUser.email === userData.email) {
        format = 'items-end ml-5'
        // Add more format based on the type
        if (type === 'text') {
            format += ' bg-theme-600 rounded-xl text-white'
        }
    } else {
        format = 'items-start text-left mr-5'
        // Add more format based on the type
        if (type === 'text') {
            format += ' bg-slate-100 rounded-xl p-2 text-slate-900'
        }
    }

    return format
}

export default function Code() {
    return (
        <div className="flex h-fullscreen">
            <section className="w-1/3 flex flex-col">
                <div className="flex items-center gap-4">
                    <Image src="/logo.svg" alt="Logo" width={28} height={28} className="my-2" />
                    <h2 className="text-lg font-medium">Session with: {collaboratorData.name}</h2>
                </div>

                <div id="question-data" className="flex-grow border-2 rounded-lg border-slate-100 mt-2 py-2 px-3">
                    <h3 className="text-lg font-medium">{questionData.title}</h3>
                    <div className="flex gap-3 my-2 text-sm">
                        <DifficultyLabel difficulty={questionData.difficulty} />
                        <CustomLabel
                            title={formatQuestionCategories(questionData.category)}
                            textColor="text-purple-600"
                            bgColor="bg-purple-100"
                        />
                    </div>
                    <div className="mt-6">{questionData.description}</div>
                </div>

                <div className="border-2 rounded-lg border-slate-100 mt-4 max-h-oneThirdScreen flex flex-col">
                    <div className="flex items-center justify-between border-b-[1px] pl-3 ">
                        <h3 className="text-lg font-medium">Chat</h3>
                        <Button variant="iconNoBorder" size="icon">
                            <Image src="/icons/minimise.svg" alt="Minimise chat" width={20} height={20} />
                        </Button>
                    </div>
                    <div className="overflow-y-auto p-3 pb-0">
                        {chatData.map((chat, index) => (
                            <div
                                key={index}
                                className={`flex flex-col gap-1 mb-5 ${getChatBubbleFormat(chat.user, 'label')}`}
                            >
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-medium">{chat.user.name}</h4>
                                    <span className="text-xs text-slate-400">{formatTimestamp(chat.timestamp)}</span>
                                </div>
                                <div
                                    className={`text-sm py-2 px-3 text-balance break-words w-full ${getChatBubbleFormat(chat.user, 'text')}`}
                                >
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="w-2/3"></section>
        </div>
    )
}
