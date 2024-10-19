import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'
import { UserQueueRequest, UserQueueRequestDto } from '../types/UserQueueRequestDto'
import mqConnection from '../services/rabbitmq.service'
import { randomUUID } from 'crypto'
import { WebSocketMessageType } from '@repo/ws-types'
import wsConnection from '../services/ws.service'
import { IMatch } from '../types/IMatch'
import { MatchDto } from '../types/MatchDto'
import { createMatch, isUserInMatch } from '../models/matching.repository'

export async function generateWS(request: ITypedBodyRequest<void>, response: Response): Promise<void> {
    const websocketID = randomUUID()
    response.status(200).send({ websocketID: websocketID })
}

export async function addUserToMatchmaking(data: UserQueueRequest): Promise<void> {
    const createDto = UserQueueRequestDto.fromJSON(data)
    const errors = await createDto.validate()
    if (errors.length) {
        return
    }
    await mqConnection.sendToEntryQueue(createDto)
}

export async function removeUserFromMatchingQueue(websocketId: string): Promise<void> {
    await mqConnection.addUserToCancelledSet(websocketId)
    wsConnection.sendMessageToUser(websocketId, JSON.stringify({ type: WebSocketMessageType.CANCEL }))
}

export async function handleCreateMatch(data: IMatch): Promise<IMatch> {
    const isAnyUserInMatch = (await isUserInMatch(data.user1Id)) || (await isUserInMatch(data.user2Id))
    if (isAnyUserInMatch) {
        throw new Error('User is already in a match')
    }
    data.questionId = randomUUID() // TODO: replace with actual question ID
    const createDto = MatchDto.fromJSON(data)
    const errors = await createDto.validate()
    if (errors.length) {
        throw new Error('Invalid match data')
    }
    return createMatch(createDto)
}
