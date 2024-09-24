import { Difficulty } from '@/types/difficulty'

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

const mockCollaboratorData: ICollaborator = {
    name: 'John Doe',
    email: 'johnnydoey@gmail.com',
}

const mockUserData: ICollaborator = {
    name: 'Oliver Wye',
    email: 'oliverwye@gmail.com',
}

const mockChatData = [
    {
        user: mockUserData,
        message: "I don't understand the question. Please help me!",
        timestamp: '2024-09-20T11:59:00',
    },
    {
        user: mockCollaboratorData,
        message: 'Hey, lets try to solve this together.',
        timestamp: '2024-09-20T12:01:00',
    },
    {
        user: mockUserData,
        message: 'Okay! I am ready',
        timestamp: '2024-09-20T12:03:00',
    },
    {
        user: mockCollaboratorData,
        message: 'Sure, lets start by understanding the question',
        timestamp: '2024-09-20T12:05:00',
    },
    {
        user: mockCollaboratorData,
        message: 'This question is about reversing a string',
        timestamp: '2024-09-20T12:08:00',
    },
    {
        user: mockUserData,
        message: 'What does reverse mean?',
        timestamp: '2024-09-20T12:09:00',
    },
]

const mockQuestionData: IQuestion = {
    title: 'Reverse a String',
    description:
        'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory. Example 1: Input: s =["h", "e", "l", "l", "o"] Output: ["o", "l", "l", "e", "h"]',
    difficulty: Difficulty.Easy,
    category: ['Array', 'Hash Table'],
}

const mockTestCaseData = [
    {
        idx: 1,
        inputVar: 's',
        input: '["h", "e", "l", "l", "o"]',
        expectedOutput: '["o", "l", "l", "e", "h"]',
    },
    {
        idx: 2,
        inputVar: 's',
        input: '["H", "a", "n", "n", "a", "h"]',
        expectedOutput: '["h", "a", "n", "n", "a", "H"]',
    },
]

export { mockCollaboratorData, mockUserData, mockChatData, mockQuestionData, mockTestCaseData }
