import { Category, Complexity, Proficiency } from '@repo/user-types'

export interface IPostMatching {
    userId: string
    proficiency: Proficiency
    difficulty: Complexity
    topic: Category
}
