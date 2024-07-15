import { httpClient } from "../http/client";
import { AuthInfoResponseBody, RegisterUserSchema } from "@repo/bff";

export const registerUser = async (
  {
    body,
    cookie,
  }: {
    cookie?: string,
    body: RegisterUserSchema
  }
): Promise<AuthInfoResponseBody> =>
  httpClient
    .headers(
      cookie
        ? {
          cookie,
        }
        : {}
    )
    .post(body, '/v1/auth/register')
    .json()