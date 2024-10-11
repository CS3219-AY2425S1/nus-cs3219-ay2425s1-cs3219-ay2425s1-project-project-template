import { Category, Complexity, Proficiency } from '@repo/user-types'
import mqConnection from '../services/rabbitmq.service'

export default async () => {
    await mqConnection.connect()
    await mqConnection.sendToEntryQueue({
        websocketId: 'test',
        proficiency: Proficiency.EXPERT,
        complexity: Complexity.EASY,
        topic: Category.ALGORITHMS,
        userId: '123',
    })
    await mqConnection.entryConsumer()
}
