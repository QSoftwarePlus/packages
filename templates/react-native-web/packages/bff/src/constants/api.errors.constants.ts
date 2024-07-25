import { StatusCodes } from "http-status-codes";

export const errorCode = [
    'error_sending_invitation_email',
    'cannot_delete_doctor_contact_book_item',
    'contact_book_item_already_exists',
    'not_found_contact_book_item',
    'invalid_query',
    'not_found_treatment',
    'not_found_patient',
    'invalid_body',
    'invalid_user_or_password',
    'username_already_exists',
    'not_found_user',
    'unauthorized',
    'test',
    'not_found_receiver',
    'invalid_x_user_type',
    'person_already_exists',
    'role_not_found',
    'invalid_params',
    'not_found_chat',
    'not_found_user_history',
    'invalid_end_date',
    'invalid_file_token',
    'not_found_medical_history',
    'invalid_tags',
    'invalid_oauth_token',
    'app_reached_user_limit',
    'treatment_has_user_history',
    'notification_not_found',
] as const

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
            key: 'error_sending_invitation_email',
            error: {
                code: 'error_sending_invitation_email',
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                description: 'Error sending invitation email',
            }
        },
        {
            key: 'contact_book_item_already_exists',
            error: {
                code: 'contact_book_item_already_exists',
                status: StatusCodes.CONFLICT,
                description: 'Contact book item already exists',
            }
        },
        {
            key: 'not_found_contact_book_item',
            error: {
                code: 'not_found_contact_book_item',
                status: StatusCodes.NOT_FOUND,
                description: 'Contact book item not found',
            }
        },
        {
            key: 'notification_not_found',
            error: {
                code: 'notification_not_found',
                status: StatusCodes.NOT_FOUND,
                description: 'Notification not found',
            }
        },
        {
            key: 'treatment_has_user_history',
            error: {
                code: 'treatment_has_user_history',
                status: StatusCodes.CONFLICT,
                description: 'treatment already have user history items',
            }
        },
        {
            key: 'not_found_receiver',
            error: {
                code: 'not_found_receiver',
                status: StatusCodes.NOT_FOUND,
                description: 'The receiver not found',
            }
        },
        {
            key: 'app_reached_user_limit',
            error: {
                code: 'app_reached_user_limit',
                status: StatusCodes.CONFLICT,
                description: 'app_reached_user_limit',
            }
        },
        {
            key: 'not_found_patient',
            error: {
                code: 'not_found_patient',
                status: StatusCodes.NOT_FOUND,
                description: 'The target patient not found',
            }
        },
        {
            key: 'not_found_chat',
            error: {
                code: 'not_found_chat',
                status: StatusCodes.NOT_FOUND,
                description: 'The target chat not found',
            }
        },
        {
            key: 'invalid_oauth_token',
            error: {
                code: 'invalid_oauth_token',
                status: StatusCodes.UNAUTHORIZED,
                description: 'The access token provided is not valid',
            }
        },
        {
            key: 'invalid_tags',
            error: {
                code: 'invalid_tags',
                status: StatusCodes.BAD_REQUEST,
                description: 'Some of tagret tags not exists',
            }
        },
        {
            key: 'invalid_file_token',
            error: {
                code: 'invalid_file_token',
                status: StatusCodes.BAD_REQUEST,
                description: 'The file token provided is not valid',
            }
        },
        {
            key: 'invalid_end_date',
            error: {
                code: 'invalid_end_date',
                status: StatusCodes.BAD_REQUEST,
                description: 'end date must be greater than or equal to start date',
            }
        },
        {
            key: 'not_found_medical_history',
            error: {
                code: 'not_found_medical_history',
                status: StatusCodes.NOT_FOUND,
                description: 'not found medical history',
            }
        },
        {
            key: 'not_found_user_history',
            error: {
                code: 'not_found_user_history',
                status: StatusCodes.NOT_FOUND,
                description: 'not found user history',
            }
        },
        {
            key: 'invalid_params',
            error: {
                code: 'invalid_params',
                status: StatusCodes.BAD_REQUEST,
                description: 'invalid_params',
            }
        },
        {
            key: 'invalid_query',
            error: {
                code: 'invalid_query',
                status: StatusCodes.BAD_REQUEST,
                description: 'invalid query',
            }
        },
        {
            key: 'not_found_treatment',
            error: {
                code: 'not_found_treatment',
                status: StatusCodes.NOT_FOUND,
                description: 'Treatment not found',
            }
        },
        {
            key: 'invalid_user_or_password',
            error: {
                code: 'invalid_user_or_password',
                status: StatusCodes.FORBIDDEN,
                description: 'User or password is invalid',
            }
        },
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
            key: 'cannot_delete_doctor_contact_book_item',
            error: {
                code: 'cannot_delete_doctor_contact_book_item',
                status: StatusCodes.CONFLICT,
                description: 'Cannot delete doctor contact book item',
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
            key: 'username_already_exists',
            error: {
                code: 'username_already_exists',
                status: StatusCodes.CONFLICT,
                description: 'Person Username already exists',
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

export const requiredFieldMessage = 'Campo requerido'