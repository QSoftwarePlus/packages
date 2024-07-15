import { useCallback, useState } from 'react'

interface IGoogleClient {
  requestAccessToken: () => void
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (input: {
            client_id: string
            scope: string
            callback: (token: { access_token: string }) => void
          }) => IGoogleClient
        }
      }
    }
  }
}

export const useGoogle = (onAccepted: (access_token: string) => void) => {
  const [googleClient, setGoogleClient] = useState<IGoogleClient>()

  const initGoogleClient = useCallback(() => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        scope:
          'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: ({ access_token }) => onAccepted(access_token),
      })

      console.log('client', client)

      setGoogleClient(client)
    }
  }, [])

  return {
    initGoogleClient,
    googleClient,
  }
}
