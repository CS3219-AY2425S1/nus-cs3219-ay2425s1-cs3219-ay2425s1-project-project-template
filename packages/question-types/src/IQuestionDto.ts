import { Category, Complexity } from '@repo/user-types'

export interface IQuestionDto {
    id: string
    title: string
    description: string
    categories: Category[]
    complexity: Complexity
    link: string
    createdAt: Date
    updatedAt: Date
}
