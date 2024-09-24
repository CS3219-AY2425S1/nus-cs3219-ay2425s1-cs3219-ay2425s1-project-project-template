import {
    createQuestion,
    findOneQuestionByTitle,
    findPaginatedQuestions,
    findQuestionCount,
} from '../models/question.repository'

import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { Response } from 'express'
import { TypedRequest } from '../types/TypedRequest'
import { ValidationError } from 'class-validator'

export async function handleCreateQuestion(
    request: TypedRequest<CreateQuestionDto>,
    response: Response
): Promise<void> {
    const createDto = CreateQuestionDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicate = await findOneQuestionByTitle(createDto.title)
    if (duplicate) {
        response.status(409).json('DUPLICATE_TITLE').send()
        return
    }

    const question = await createQuestion(createDto)
    response.status(201).json(question).send()
}

export async function getPaginatedQuestions(request: TypedRequest<void>, response: Response): Promise<void> {
    const page = parseInt(request.params.page as string)
    const limit = parseInt(request.query.limit as string)

    const start = (page - 1) * limit
    const count = await findQuestionCount()

    const questions = await findPaginatedQuestions(start, limit)

    const nextPage = start + limit < count ? page + 1 : null

    response.status(200).json({
        currentPage: page,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        nextPage,
        questions,
    })
}
