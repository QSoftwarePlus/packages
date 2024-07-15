import { UserType } from '@repo/bff'
import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const httpClient = wretch(BASE_URL)
    //   .middlewares([
    //     (next) => (url, opts) => {
    //       try {
    //         return next(url, opts).then(async (res) => {
    //           if (res.status === 401 && typeof window !== 'undefined') {
    //             const isPublic = publicRoutes.some((route) =>
    //               window.location.pathname.includes(route),
    //             )

    //             if (!isPublic) {
    //               window.location.href = '/login'
    //             }
    //           }

    //           if (res.status === 403 && typeof window === 'undefined') {
    //             const response = await res.json()

    //             if (response.code === 'invalid_role') {
    //               notFound()
    //             }
    //           }

    //           return res
    //         })
    //       } catch (err) {
    //         return Promise.reject(err)
    //       }
    //     },
    //   ])
    .options({
        cache: 'no-cache',
        credentials: 'include',
        mode: 'cors',
    })
      .headers({
        'x-user-type': 'cannabis_consumer' satisfies UserType,
      })
    .addon(QueryStringAddon)
