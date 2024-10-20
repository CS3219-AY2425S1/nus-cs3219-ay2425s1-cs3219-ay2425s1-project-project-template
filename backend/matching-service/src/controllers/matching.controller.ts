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
    if (mqConnection.userCurrentlyConnected(request.user.id)) {
        response.status(400).send({ error: 'User already connected' })
        return
    }
    mqConnection.addUserConnected(request.user.id)

    const websocketID = randomUUID()
    response.status(200).send({ websocketID: websocketID })
}

export async function addUserToMatchmaking(data: UserQueueRequest): Promise<void> {
    const isAnyUserInMatch = await isUserInMatch(data.userId)
    if (isAnyUserInMatch) {
        wsConnection.sendMessageToUser(data.websocketId, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
        return
    }
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

export async function handleCreateMatch(data: IMatch, ws1: string, ws2: string): Promise<IMatch> {
    const isAnyUserInMatch = (await isUserInMatch(data.user1Id)) || (await isUserInMatch(data.user2Id))
    if (isAnyUserInMatch) {
        wsConnection.sendMessageToUser(ws1, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
        wsConnection.sendMessageToUser(ws2, JSON.stringify({ type: WebSocketMessageType.DUPLICATE }))
    }
    data.questionId = randomUUID() // TODO: replace with actual question ID
    const createDto = MatchDto.fromJSON(data)
    const errors = await createDto.validate()
    if (errors.length) {
        throw new Error('Invalid match data')
    }
    wsConnection.sendMessageToUser(ws1, JSON.stringify({ type: WebSocketMessageType.SUCCESS }))
    wsConnection.sendMessageToUser(ws2, JSON.stringify({ type: WebSocketMessageType.SUCCESS }))
    return createMatch(createDto)
}
