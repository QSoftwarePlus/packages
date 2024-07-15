import * as z from 'zod'
import { entitySchema } from './entity.schema';
import { UserType, userType } from '../constants/user-type.constant';
import { identityProviders } from '../constants/providers.constants';
import { UserModel } from '../models/user.model';

export const loginWithUserAndPassword = z.object({
    email: z.string().email(),
    password: z.string(),
})

export type LoginWithUserAndPasswordSchema = z.infer<typeof loginWithUserAndPassword>

export const loginWithIdpSchema = z.object({
    provider: z.enum(identityProviders),
    access_token: z.string().min(1),
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
    user_type: z.enum(userType),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>

export const registerUserResponseBody = z.object({
    access_token: z.string().min(1),
    user_type: z.enum(userType),
})

export type RegisterUserResponseBody = z.infer<typeof registerUserResponseBody>

export type AuthInfoResponseBody = UserModel

export const loginUserResponseBody = z.object({
    access_token: z.string().min(1),
    user_type: z.enum(userType),
});

export type LoginUserResponseBody = z.infer<typeof loginUserResponseBody>