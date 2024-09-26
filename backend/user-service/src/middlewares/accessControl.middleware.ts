import { Role } from '@repo/user-types/Role'
import { NextFunction, Request, Response } from 'express'
import logger from '../common/logger.util'
import { UserDto } from '../types/UserDto'

export function handleRoleBasedAccessControl(roles: Role[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        const user: UserDto | undefined = request.user as UserDto
        if (!user) {
            logger.error(
                `[Access Control] [${request.method} ${request.baseUrl + request.path}] User is not authenticated.`
            )
            response.status(500).send()
            return
        }

        if (!roles.includes(user.role)) {
            response.status(403).json('INSUFFICIENT_PERMISSIONS').send()
            return
        }

        next()
    }
}

export async function handleOwnershipAccessControl(request: Request, response: Response, next: NextFunction) {
    const user: UserDto | undefined = request.user as UserDto
    if (!user) {
        logger.error(
            `[Access Control] [${request.method} ${request.baseUrl + request.path}] User is not authenticated.`
        )
        response.status(500).send()
        return
    }

    if (user.id !== request.params.id) {
        response.status(403).json('INSUFFICIENT_PERMISSIONS').send()
        return
    }

    next()
}
