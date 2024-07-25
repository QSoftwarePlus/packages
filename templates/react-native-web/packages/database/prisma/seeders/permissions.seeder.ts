import { Permission, PrismaClient } from '@prisma/client'
import { Seeder } from 'prisma/seed'
import { PrismaClientSeed } from '../client'

export const cannabisConsumerBasePermissions: Pick<Permission, 'type' | 'scope'>[] = [
  {
    type: 'can_read_user',
    scope: 'own',
  },
]

export const doctorBasePermissions: Pick<Permission, 'type' | 'scope'>[] = [
  {
    type: 'can_read_user',
    scope: 'own',
  },
  {
    type: 'can_read_user',
    scope: 'patient',
  },
];

export class PermissionSeeder implements Seeder {
  readonly id = 'permission-seeder'

  async seed(prisma: PrismaClientSeed) {
    const allPermissions = [
      ...cannabisConsumerBasePermissions,
      ...doctorBasePermissions,
    ]

    for (const { scope, type } of allPermissions) {
      const permission = await prisma.permission.findFirst({
        where: {
          scope,
          type,
        },
      })

      if (!permission) {
        await prisma.permission.create({
          data: {
            type,
            scope,
          },
        })
      }

      if (permission) {
        await prisma.permission.update({
          where: {
            id: permission.id,
          },
          data: {
            type,
            scope,
          },
        })
      }
    }
  }
}
