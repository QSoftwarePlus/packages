import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoginUserResponseBody } from 'bff';
import { Response } from 'express';
import { catchError, map } from 'rxjs';
import { ACCESS_TOKEN_LONG_MS_EXPIRATION, COOKIE_PRODUCTION_PROPS, IS_DEV_ENV, USER_TYPE_COOKIE_NAME, buildCookieName } from 'src/constants/contants';
import { AppError, AppServiceResponse, AppSuccess } from 'src/utils/application-service';

export interface SessionTokenClaimsData {
  user_id: number;
}

export interface ISessionTokenClaims
  extends AppSuccess<SessionTokenClaimsData> { }

export const getCookieAttributes = () => {
  if (IS_DEV_ENV) {
    if (process.env['HTTP_ONLY'] === 'true') {
      return {};
    }

    return {
      // domain: '.feelgood.localhost',
      // secure: true,
      // httpOnly: true,
    };
  }

  return COOKIE_PRODUCTION_PROPS;
};

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const response: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (body: AppServiceResponse<LoginUserResponseBody>) => {
        if (body instanceof AppError) {
          return body;
        }

        response.cookie(buildCookieName(body.data.user_type), body.data.access_token, {
          maxAge: ACCESS_TOKEN_LONG_MS_EXPIRATION,
          ...getCookieAttributes(),
        })

        // response.cookie(
        //   buildCookieName(body.data.user_type),
        //   body.data.access_token,
        //   {
        //     maxAge: ACCESS_TOKEN_LONG_MS_EXPIRATION,
        //     // ...getCookieAttributes(),
        //   },
        // );

        // response.cookie(USER_TYPE_COOKIE_NAME, body.data.user_type, {
        //   maxAge: ACCESS_TOKEN_LONG_MS_EXPIRATION,
        //   ...getCookieAttributes(),
        // });

        return body;
      }),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
