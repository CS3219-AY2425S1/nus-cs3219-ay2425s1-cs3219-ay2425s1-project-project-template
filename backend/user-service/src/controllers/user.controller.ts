import { createUser, findOneUserByEmail, findOneUserByUsername, updateUser } from '../models/user.repository'

import { ValidationError } from 'class-validator'
import { Response } from 'express'
import { CreateUserDto } from '../types/CreateUserDto'
import { TypedRequest } from '../types/TypedRequest'
import { UserDto } from '../types/UserDto'
import { UserProfileDto } from '../types/UserProfileDto'
import { hashPassword } from './auth.controller'

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

    const user = await updateUser(id, createDto)
    response.status(200).json(user).send()
}
