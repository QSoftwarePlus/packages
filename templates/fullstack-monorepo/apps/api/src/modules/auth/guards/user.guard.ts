import { validate } from 'nestjs-zod';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { accessTokenSchema, buildError } from '@repo/bff';
import { UserType } from 'database';
import { Request, Response } from 'express';
import { REQUEST_USER_KEY, buildCookieName } from 'src/constants/contants';
import { DatabaseService } from 'src/modules/database/database.service';
import { JWT_SESSION_PROVIDER_TOKEN } from 'src/modules/jwt-session/jwt-session.module';
import { AppError } from 'src/types/application-service';
import { SafeParseError } from 'zod'

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
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const userType =
      request.get('x-user-type')

    if (!userType) {
      throw new AppError({
        ...buildError('invalid_x_user_type'),
      })
    }

    const cookieName = buildCookieName(userType as UserType);

    try {
      const sessionCookie = request.cookies[cookieName];

      const tokenPayload = this.jwtService.verify(sessionCookie);

      const claims = validate(tokenPayload, accessTokenSchema);

      const user = await this.findUser({
        id: claims.sub,
        type: userType as UserType,
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

  public getRequestUserContextFields(request: Request) {
    return {
      remoteIp: getClientIPFromRequest(request),
    };
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
