import { httpClient } from "../http/client";
import { AuthInfoResponseBody } from "@repo/bff";

export const fetchUser = async (
    cookie?: string
  ): Promise<AuthInfoResponseBody> =>
    httpClient
      .headers(
        cookie
          ? {
              cookie,
            }
          : {}
      )
      .get('/v1/auth/me')
      .json()