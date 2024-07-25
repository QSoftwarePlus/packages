export const xUserTypeHeader = 'x-user-type'

export const sortTypes = ['asc', 'desc'] as const

export type SortType = (typeof sortTypes)[number]

export const authHeader = 'Authorization'

export const globalApiPrefix = '/v1'