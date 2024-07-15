import { UserType } from "@repo/bff";

export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export const PASSWORD_SALT = 8

export const COOKIE_PRODUCTION_PROPS = {
    domain: '.feelgood.com.ar',
    secure: true,
    httpOnly: true,
};

export const buildCookieName = (type: UserType): `${UserType}_session` =>
    `${type}_session` as const;

export const ACCESS_TOKEN_LONG_MS_EXPIRATION = 525600 * 60 * 950;

export const USER_TYPE_COOKIE_NAME = 'user_type';

export const REQUEST_USER_KEY = 'user';

export const REQUEST_SESSION_KEY = 'session';