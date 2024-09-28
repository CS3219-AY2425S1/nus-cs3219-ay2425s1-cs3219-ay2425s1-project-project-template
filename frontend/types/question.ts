import { Difficulty } from './difficulty'

export enum QuestionStatus {
    COMPLETED = 'completed',
    FAILED = 'failed',
    NOT_ATTEMPTED = 'not_attempted',
}
export interface IQuestion {
    id?: number
    title: string
    description: string
    difficulty: Difficulty
    category: string[]
    status?: QuestionStatus
}
