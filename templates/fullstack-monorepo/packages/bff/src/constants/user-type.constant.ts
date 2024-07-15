import { UserType as UType } from 'database';

export const userType = [UType.cannabis_consumer, UType.doctor] as const

export type UserType = UType