import { UserType } from "database";


export const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export const PASSWORD_SALT = 8

export const COOKIE_PRODUCTION_PROPS = {
    domain: '.qs-feelgood.com',
    secure: true,
    httpOnly: true,
};

export const buildCookieName = (type: UserType): `${UserType}_session` =>
    `${type}_session` as const;

export const ACCESS_TOKEN_LONG_MS_EXPIRATION = 525600 * 60 * 950;

export const USER_TYPE_COOKIE_NAME = 'user_type';

export const REQUEST_USER_KEY = 'user';

export const REQUEST_SESSION_KEY = 'session';

export const AWS_OUTPUTS_BUCKET_NAME = 'AWS_OUTPUTS_BUCKET_NAME';

export const AWS_BUCKET_NAME = 'AWS_BUCKET_NAME';

export const AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID';

export const AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY';

export const AWS_ENDPOINT = 'AWS_ENDPOINT';

export const DEFAULT_FILE_PRESIGN_EXPIRATION_IN_SECONDS = 86400;

export const MAX_FILE_SIZE_IN_MB = 20;

//20mb
export const MAX_FILE_SIZE_IN_BYTES = Math.floor(
    MAX_FILE_SIZE_IN_MB * 1024 * 1024,
);

export const DISCORD_BOT_TOKEN = 'DISCORD_BOT_TOKEN'

export const DISCORD_CHANNEL_OPS_ID = 'DISCORD_CHANNEL_OPS_ID'