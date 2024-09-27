import { Proficiency } from '@repo/user-types/Proficiency'
import { Role } from '@repo/user-types/Role'

export interface IUser {
    id: string
    username: string
    email: string
    password: string
    role: Role
    proficiency?: Proficiency
    verificationToken?: string
}
