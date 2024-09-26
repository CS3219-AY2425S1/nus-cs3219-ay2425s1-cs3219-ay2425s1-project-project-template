import { IUserDto } from '@repo/user-types/IUserDto'
import { Request } from 'express'

export interface IAuthenticatedRequest extends Request {
    user: IUserDto
}
