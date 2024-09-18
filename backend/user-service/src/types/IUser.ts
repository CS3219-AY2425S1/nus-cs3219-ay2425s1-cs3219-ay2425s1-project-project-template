import { Proficiency } from './Proficiency'
import { Role } from './Role'

export interface IUser {
    id: string
    username: string
    email: string
    password: string
    role: Role
    proficiency?: Proficiency
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}
