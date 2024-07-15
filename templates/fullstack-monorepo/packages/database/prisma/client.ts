import { PrismaClient } from '@prisma/client'
import cursorStream from 'prisma-cursorstream'

export const generatePrismaClient = () =>
  new PrismaClient().$extends(cursorStream)

export type PrismaClientSeed = ReturnType<typeof generatePrismaClient>
