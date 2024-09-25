import {
    createQuestion,
    findOneQuestionById,
    findOneQuestionByTitle,
    findPaginatedQuestions,
    findQuestionCount,
} from '../models/question.repository'

import { ValidationError } from 'class-validator'
import { Response } from 'express'
import { CreateQuestionDto } from '../types/CreateQuestionDto'
import { IPaginationRequest } from '../types/IPaginationRequest'
import { QuestionDto } from '../types/QuestionDto'
import { TypedRequest } from '../types/TypedRequest'

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
    const dto = QuestionDto.fromModel(question)
    response.status(201).json(dto).send()
}

export async function handleGetPaginatedQuestions(request: IPaginationRequest, response: Response): Promise<void> {
    const page = parseInt(request.query.page)
    const limit = parseInt(request.query.limit)

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        response.status(400).json('INVALID_PAGINATION').send()
        return
    }

    const start = (page - 1) * limit
    const count = await findQuestionCount()

    const questions = await findPaginatedQuestions(start, limit)
    const nextPage = start + limit < count ? page + 1 : null

    response.status(200).json({
        pagination: {
            currentPage: page,
            nextPage,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
        },
        questions: questions.map(QuestionDto.fromModel),
    })
}

export async function handleGetQuestionById(request: TypedRequest<void>, response: Response): Promise<void> {
    const id = request.params.id

    const question = await findOneQuestionById(id)

    if (!question) {
        response.status(404).json('NOT_FOUND').send()
        return
    }

    const dto = QuestionDto.fromModel(question)
    response.status(200).json(dto).send()
}
