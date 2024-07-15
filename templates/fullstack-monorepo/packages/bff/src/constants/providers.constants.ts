export const identityProviders = ['google'] as const

export type IdentityProviders = (typeof identityProviders)[number]