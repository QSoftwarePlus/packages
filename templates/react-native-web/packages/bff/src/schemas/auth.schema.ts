import * as z from 'zod'
import { UserModel } from '../models/user.model';
import { IdentityProviderType, UserType } from 'database';
import { AppSuccessData } from './success.schema';

export const userTypeSchema = z.nativeEnum(UserType)

export const loginWithUserAndPassword = z.object({
    email: z.string().email(),
    password: z.string(),
})

export type LoginWithUserAndPasswordSchema = z.infer<typeof loginWithUserAndPassword>

export const updateUserPasswordSchema = z.object({
    old_password: z.string(),
    new_password: z.string(),
    new_password_confirmation: z.string(),
}).refine(({ new_password, new_password_confirmation, old_password }) => {
    if (old_password === new_password) {
        return false
    }

    if (new_password !== new_password_confirmation) {
        return false
    }

    return true
}, {
    message: 'Passwords do not match',
    path: ['new_password'],
})

export type UpdateUserPasswordRequestBody = z.infer<typeof updateUserPasswordSchema>

export type UpdateUserPasswordResponseBody = AppSuccessData

export const loginWithIdpSchema = z.object({
    provider: z.nativeEnum(IdentityProviderType),
    access_token: z.string().min(1),
    user_type: z.nativeEnum(UserType),
})

export type LoginWithIdpSchema = z.infer<typeof loginWithIdpSchema>

export const accessTokenSchema = z.object({
    sub: z.number().min(1),
})

export type SessionAccessToken = z.infer<typeof accessTokenSchema>

export const registerUserSchema = loginWithUserAndPassword.extend({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    username: z.string().min(1),
    user_type: z.nativeEnum(UserType),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>

export const registerUserResponseBody = z.object({
    access_token: z.string().min(1),
    user_type: z.nativeEnum(UserType),
})

export type RegisterUserResponseBody = z.infer<typeof registerUserResponseBody>

export type AuthInfoResponseBody = UserModel & {
    person_missing_fields: {
        isMissing: boolean,
        missing_fields: string[],
    },
}

export const loginUserResponseBody = z.object({
    access_token: z.string().min(1),
    user_type: z.nativeEnum(UserType),
});

export type LoginUserResponseBody = z.infer<typeof loginUserResponseBody>

const jwtRegex = /^Bearer\s[eyJ0-9a-zA-Z-_=]+\.[0-9a-zA-Z-_=]+\.[0-9a-zA-Z-_=]+$/;

export const bearerTokenSchema = z.string().regex(jwtRegex, {
    message: "Invalid Bearer token format",
});
