import { ValidationError } from 'class-validator'
import { Response } from 'express'
import logger from '../common/logger.util'
import { createUser, findOneUserByEmail, findOneUserByUsername } from '../models/user.repository'
import { CreateUserDto } from '../types/CreateUserDto'
import { Proficiency } from '../types/Proficiency'
import { Role } from '../types/Role'
import { TypedRequest } from '../types/TypedRequest'
import { UserDto } from '../types/UserDto'
import { hashPassword } from './auth.controller'

export async function handleCreateUser(
    request: TypedRequest<{
        username: string
        password: string
        email: string
        role: Role
        proficiency: Proficiency | undefined
    }>,
    response: Response
): Promise<void> {
    const createDto = CreateUserDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        logger.info(`[Controller] [POST /users] User validation failed: ${errors}`)
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const duplicateUsername = await findOneUserByUsername(createDto.username)
    if (duplicateUsername) {
        response.status(409).json('DUPLICATE_USERNAME').send()
        return
    }
    const duplicateEmail = await findOneUserByEmail(createDto.email)
    if (duplicateEmail) {
        response.status(409).json('DUPLICATE_EMAIL').send()
        return
    }

    createDto.password = await hashPassword(createDto.password)
    const user = await createUser(createDto)
    const dto = UserDto.fromModel(user)

    response.status(201).json(dto).send()
}
