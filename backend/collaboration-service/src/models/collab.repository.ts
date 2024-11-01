import { Model, model } from 'mongoose'
import { CollabDto } from '../types/CollabDto'
import collabSchema from './collab.model'
import { ChatModel } from '../types'

const collabModel: Model<CollabDto> = model('collab', collabSchema)

export async function createSession(dto: CollabDto): Promise<CollabDto> {
    return collabModel.create({
        _id: dto.matchId,
        language: dto.language,
        code: dto.code,
        executionResult: dto.executionResult,
        chatHistory: dto.chatHistory,
        createdAt: dto.createdAt,
    })
}

export async function getSessionById(id: string): Promise<CollabDto> {
    return collabModel.findById(id)
}

export async function updateChatHistory(id: string, chatEntry: ChatModel) {
    return collabModel.updateOne({ _id: id }, { $push: { chatHistory: chatEntry } })
}

export async function saveCode(id: string, code: string) {
    return collabModel.updateOne({ _id: id }, { $set: { code: code } })
}

export async function saveResult(id: string, result: string) {
    return collabModel.updateOne({ _id: id }, { $set: { executionResult: result } })
}
