import { Model, model } from 'mongoose'
import matchSchema from './matching.model'
import { IMatch } from '../types/IMatch'
import { Category, Complexity } from '@repo/user-types'

const matchModel: Model<IMatch> = model('Match', matchSchema)

export async function createMatch(
    user1: string,
    user2: string,
    complexity: Complexity,
    categories: Category[],
    timestamp: number
): Promise<IMatch> {
    const questionId = '1fkjsn92ehd' // TODO: get random question id from question service
    return matchModel.create({
        user1Id: user1,
        user2Id: user2,
        questionId: questionId,
        isCompleted: false,
        complexity: complexity,
        topic: categories,
        createdAt: new Date(timestamp),
    })
}
