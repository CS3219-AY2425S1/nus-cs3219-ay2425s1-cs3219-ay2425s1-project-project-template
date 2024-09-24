import { Difficulty } from './difficulty'

export interface IQuestion {
    title: string
    description: string
    difficulty: Difficulty
    category: string[]
}
