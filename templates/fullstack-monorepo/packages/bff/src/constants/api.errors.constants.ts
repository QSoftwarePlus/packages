import { StatusCodes } from "http-status-codes";

export const errorCode = ['invalid_body', 'not_found_user', 'unauthorized', 'test', 'invalid_x_user_type', 'person_already_exists', 'role_not_found'] as const

export type ErrorCode = typeof errorCode[number]

interface Error {
    code: string;
    status: number;
    description: string;
}

export const apiErrors: {
    key: ErrorCode,
    error: Error
}[] = [
        {
            key: 'invalid_body',
            error: {
                code: 'invalid_body',
                status: StatusCodes.BAD_REQUEST,
                description: 'Invalid body',
            }
        },
        {
            key: 'not_found_user',
            error: {
                code: 'not_found_user',
                status: StatusCodes.NOT_FOUND,
                description: 'Not found target user',
            }
        },
        {
            key: 'invalid_x_user_type',
            error: {
                code: 'invalid_x_user_type',
                status: StatusCodes.FORBIDDEN,
                description: 'Invalid x_user_type',
            }
        },
        {
            key: 'person_already_exists',
            error: {
                code: 'person_already_exists',
                status: StatusCodes.CONFLICT,
                description: 'Person email already exists',
            }
        },
        {
            key: 'role_not_found',
            error: {
                code: 'role_not_found',
                status: StatusCodes.NOT_FOUND,
                description: 'Target role not found',
            }
        },
        {
            key: 'unauthorized',
            error: {
                code: 'unauthorized',
                status: StatusCodes.UNAUTHORIZED,
                description: 'unauthorized session',
            }
        }
    ]

export const buildError = (error: ErrorCode): Error => {
    return apiErrors.find(err => err.key === error)?.error!
}   