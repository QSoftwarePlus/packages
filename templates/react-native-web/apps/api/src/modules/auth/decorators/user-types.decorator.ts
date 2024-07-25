import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { buildError, nativeEnumToArray, xUserTypeHeader } from 'bff';
import { UserType } from 'database';
import { AppError } from 'src/utils/application-service';

export const USER_TYPES_METADATA_KEY = 'user_types';

export const UserTypes = (...types: UserType[]) =>
  SetMetadata(USER_TYPES_METADATA_KEY, types);

export const RequestUserType = createParamDecorator(
  (_, executionContext: ExecutionContext) => {
    const request = executionContext.switchToHttp().getRequest();

    const value = request.header(xUserTypeHeader)

    if (!nativeEnumToArray(UserType).includes(value as UserType)) {
      throw new AppError({
        ...buildError('invalid_x_user_type'),
      })
    }

    return value as UserType;
  },
);
