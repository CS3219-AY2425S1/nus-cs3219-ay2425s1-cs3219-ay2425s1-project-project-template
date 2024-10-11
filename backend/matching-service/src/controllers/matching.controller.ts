import { ITypedBodyRequest } from '@repo/request-types'
import { Response } from 'express'

import { ValidationError } from 'class-validator'
import { UserQueueRequestDto } from '../types/UserQueueRequestDto'

export async function addUserToMatchingQueue(
    request: ITypedBodyRequest<UserQueueRequestDto>,
    response: Response
): Promise<void> {
    const createDto = UserQueueRequestDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }
    response.status(200).send()
}
