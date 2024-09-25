import { Request } from 'express'

export interface IPaginationRequest
    extends Request<
        object,
        object,
        object,
        {
            page: string
            limit: string
        }
    > {
    query: {
        page: string
        limit: string
    }
}
