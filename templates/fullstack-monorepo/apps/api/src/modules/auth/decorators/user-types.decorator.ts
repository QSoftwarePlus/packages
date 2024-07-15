import { SetMetadata } from '@nestjs/common';
import { UserType } from '@repo/bff';

export const USER_TYPES_METADATA_KEY = 'user_types';

export const UserTypes = (...types: UserType[]) =>
  SetMetadata(USER_TYPES_METADATA_KEY, types);
