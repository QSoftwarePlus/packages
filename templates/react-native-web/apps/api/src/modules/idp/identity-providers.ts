import { Injectable } from '@nestjs/common';
import { GoogleProvider } from './google.provider';
import { IdentityProviderType, Person } from 'database';
import { AppError } from 'src/utils/application-service';
import { buildError } from 'bff';

export type IdentityProviderVerify = Pick<
  Person,
  'first_name' | 'last_name' | 'email' | 'profile_photo'
> & {
  provider_id: string;
};

export interface IIdentityProvider {
  verify(access_token: string): Promise<IdentityProviderVerify>;
}

@Injectable()
export class IdentityProviders {
  constructor(
    private readonly google: GoogleProvider,
  ) { }

  async verifyOrReject(
    provider: IdentityProviderType,
    access_token: string,
  ): Promise<IdentityProviderVerify> {
    try {
      switch (provider) {
        case 'google':
          return await this.google.verify(access_token);

        default:
          return await this.google.verify(access_token);
      }
    } catch (err) {
      throw new AppError({
        ...buildError('invalid_oauth_token')
      });
    }
  }
}
