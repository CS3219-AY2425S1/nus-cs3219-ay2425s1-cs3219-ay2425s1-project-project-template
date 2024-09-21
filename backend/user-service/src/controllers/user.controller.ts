import {
    createUser,
    deleteUser,
    findOneUserByEmail,
    findOneUserByUsername,
    updateUser,
} from '../models/user.repository'

import { CreateUserDto } from '../types/CreateUserDto'
import { Response } from 'express'
import { TypedRequest } from '../types/TypedRequest'
import { UserDto } from '../types/UserDto'
import { UserProfileDto } from '../types/UserProfileDto'
import { ValidationError } from 'class-validator'
import { hashPassword } from './auth.controller'
import logger from '../common/logger.util'

export async function handleCreateUser(request: TypedRequest<CreateUserDto>, response: Response): Promise<void> {
    const createDto = CreateUserDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
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

export async function handleUpdateProfile(request: TypedRequest<UserProfileDto>, response: Response): Promise<void> {
    const createDto = UserProfileDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const id = request.params.id

    const duplicateUsername = await findOneUserByUsername(createDto.username)
    if (duplicateUsername && duplicateUsername.id !== id) {
        response.status(409).json(['DUPLICATE_USERNAME']).send()
        return
    }

    try {
        const user = await updateUser(id, createDto)
        response.status(200).json(user).send()
    } catch (e) {
        logger.error(e)
        response.status(500).json(['INVALID_USER_ID']).send()
    }
}

export async function handleDeleteUser(request: TypedRequest<void>, response: Response): Promise<void> {
    const id = request.params.id

    try {
        const user = await deleteUser(id)
        response.status(200).json(user).send()
    } catch (e) {
        logger.error(e)
        response.status(500).json(['INVALID_USER_ID']).send()
    }
}
