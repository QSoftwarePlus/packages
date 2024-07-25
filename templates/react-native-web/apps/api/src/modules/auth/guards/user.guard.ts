import { validate } from 'nestjs-zod';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { accessTokenSchema, authHeader, bearerTokenSchema, buildError, globalApiPrefix, userTypeSchema, xUserTypeHeader } from 'bff';
import { UserType } from 'database';
import { Request, Response } from 'express';
import { REQUEST_USER_KEY, buildCookieName } from 'src/constants/contants';
import { DatabaseService } from 'src/modules/database/database.service';
import { JWT_SESSION_PROVIDER_TOKEN } from 'src/modules/jwt-session/jwt-session.module';
import { AppError } from 'src/utils/application-service';
import { ZodError } from 'zod'

const publicRoutes = [
  '/hello',
  '/auth/login',
  '/auth/login/idp',
  '/auth/register',
  '/auth/register/idp',
  '/auth/refresh',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const getClientIPFromRequest = (request: Request) =>
  (request.header('x-forwarded-for') || request.socket.remoteAddress)!;

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

export type RequestUser = NonNullable<
  NoUndefinedField<
    Awaited<ReturnType<(typeof UserGuard.prototype)['findUser']>>
  >
> &
  ReturnType<(typeof UserGuard.prototype)['getRequestUserContextFields']>;

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(JWT_SESSION_PROVIDER_TOKEN)
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const path = request.path;

    if (publicRoutes.map((route) => `${globalApiPrefix}${route}`).includes(path)) return true;

    const auth = request.header(authHeader);

    if (!auth) {
      throw new AppError({
        ...buildError('unauthorized'),
      })
    }

    const { success, data, error } = bearerTokenSchema.safeParse(auth);

    if (!success || !data || error) {
      throw new AppError({
        ...buildError('unauthorized'),
        errors: (error as ZodError).errors,
      })
    }

    const token = this.extractTokenFromHeader(data);

    if (!token) {
      throw new AppError({
        ...buildError('unauthorized'),
      })
    }

    const userType = this.validateUserType(request);

    try {
      const tokenPayload = this.jwtService.verify(token);

      const claims = validate(tokenPayload, accessTokenSchema);

      const user = await this.findUser({
        id: claims.sub,
        type: userType,
      });

      if (!user) {
        throw new AppError({
          ...buildError('unauthorized'),
        })
      }

      const ctxFields = this.getRequestUserContextFields(request);

      // @ts-ignore
      request[REQUEST_USER_KEY] = {
        ...user,
        ...ctxFields,
      };

      return true;
    } catch (err) {
      console.log('user guard error', err);
      if (err instanceof AppError) throw err;

      throw new AppError({
        ...buildError('unauthorized'),
      })
    }
  }

  private extractTokenFromHeader(plain: string) {
    const [type, token] = plain.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public getRequestUserContextFields(request: Request) {
    return {
      remoteIp: getClientIPFromRequest(request),
    };
  }

  private validateUserType(request: Request) {
    const userType = request.get(xUserTypeHeader)

    const err = buildError('invalid_x_user_type');

    if (!userType) {
      throw new AppError(err)
    }

    const { success, data, error } = userTypeSchema.safeParse(userType);

    if (!success || !data || error) {
      throw new AppError(err)
    }

    return data satisfies UserType;
  }

  public async findUser({ id, type }: { id: number; type: UserType }) {
    return await this.db.user.findFirst({
      where: {
        user_type: type,
        id,
      },
      include: {
        person: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }
}
