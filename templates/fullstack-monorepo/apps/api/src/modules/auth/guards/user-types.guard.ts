import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType, buildError, xUserTypeHeader } from '@repo/bff';
import { Request } from 'express';
import { USER_TYPES_METADATA_KEY } from '../decorators/user-types.decorator';
import { AppError } from 'src/types/application-service';

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const types =
      this.reflector.get<UserType[]>(
        USER_TYPES_METADATA_KEY,
        context.getHandler(),
      ) ||
      this.reflector.get<UserType[]>(
        USER_TYPES_METADATA_KEY,
        context.getClass(),
      );

    if (!types?.length) return true;

    const value = request.header(xUserTypeHeader)

    if (!types.includes(value as UserType)) {
      throw new AppError({
        ...buildError('invalid_x_user_type'),
      })
    }

    return true;
  }
}
