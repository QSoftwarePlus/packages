import { Permission, PrismaClient } from '@prisma/client'
import { Seeder } from 'prisma/seed'
import { PrismaClientSeed } from '../client'
import { equal } from 'node:assert'

export class AppConfigSeeder implements Seeder {
  readonly id = 'app-config-seeder'

  async seed(prisma: PrismaClientSeed) {
    await prisma.appConfig.upsert({
      create: {
        default: true,
        limits: {
          connectOrCreate: [
            {
              create: {
                discriminator_key: 'default_user',
                type: 'user',
                max: 30,
              },
              where: {
                type_discriminator_key: {
                  discriminator_key: 'default_user',
                  type: 'user',
                },
              },
            },
            {
              create: {
                discriminator_key: 'doctor',
                type: 'user',
                max: 10,
              },
              where: {
                type_discriminator_key: {
                  discriminator_key: 'doctor',
                  type: 'user',
                },
              },
            }
          ],
        }
      },
      update: {
        default: true,
        limits: {
          connectOrCreate: [
            {
              create: {
                discriminator_key: 'default_user',
                type: 'user',
                max: 30,
              },
              where: {
                type_discriminator_key: {
                  discriminator_key: 'default_user',
                  type: 'user',
                },
              },
            },
            {
              create: {
                discriminator_key: 'doctor',
                type: 'user',
                max: 10,
              },
              where: {
                type_discriminator_key: {
                  discriminator_key: 'doctor',
                  type: 'user',
                },
              },
            }
          ],
        }
      },
      where: {
        default: true,
      },
    })
  }
}
