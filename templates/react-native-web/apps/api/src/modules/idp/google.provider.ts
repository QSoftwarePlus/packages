import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IIdentityProvider, IdentityProviderVerify } from './identity-providers';

interface GoogleAuthResponse {
  email: string;
  id: string;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
}

@Injectable()
export class GoogleProvider implements IIdentityProvider {
  constructor(private readonly httpService: HttpService) {}

  async verify(access_token: string): Promise<IdentityProviderVerify> {
    const { data } = await this.httpService.axiosRef.get<GoogleAuthResponse>(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return {
      profile_photo: data.picture,
      first_name: data.given_name,
      last_name: data.family_name,
      email: data.email,
      provider_id: data.id,
    };
  }
}
