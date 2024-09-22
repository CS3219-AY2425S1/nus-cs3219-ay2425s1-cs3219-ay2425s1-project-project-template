import { Complexity } from './Complexity'

export interface IQuestion {
    id: string
    title: string
    description: string
    categories: string[]
    complexity: Complexity
    link: string
    createdAt: Date
    updatedAt: Date
}
