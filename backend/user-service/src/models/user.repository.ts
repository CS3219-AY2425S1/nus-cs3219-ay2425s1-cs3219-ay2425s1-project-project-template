import { Model, model } from 'mongoose'

import { CreateUserDto } from '../types/CreateUserDto'
import { IUser } from '../types/IUser'
import { UserDto } from '../types/UserDto'
import { UserProfileDto } from '../types/UserProfileDto'
import userSchema from './user.model'

const userModel: Model<IUser> = model('User', userSchema)

export async function findAllUsers(): Promise<IUser[]> {
    return userModel.find()
}

export async function findOneUserById(id: string): Promise<IUser | null> {
    return userModel.findById(id)
}

export async function findOneUserByUsername(username: string): Promise<IUser | null> {
    return userModel.findOne({ username })
}

export async function findOneUserByEmail(email: string): Promise<IUser | null> {
    return userModel.findOne({ email })
}

export async function createUser(dto: CreateUserDto): Promise<IUser> {
    return userModel.create(dto)
}

export async function updateUser(id: string, dto: UserDto | UserProfileDto): Promise<IUser | null> {
    return userModel.findByIdAndUpdate(id, dto, { new: true })
}

export async function deleteUser(id: string): Promise<void> {
    await userModel.findByIdAndDelete(id)
}
