import { Seeder } from 'prisma/seed'
import {
  cannabisConsumerBasePermissions,
} from './permissions.seeder'
import { PrismaClientSeed } from '../client'

export class RoleSeeder implements Seeder {
  readonly id: string = 'role-seeder-v1'

  async seed(prisma: PrismaClientSeed): Promise<void> {
    const cannabisConsumerBasePermission = await prisma.permission.findMany({
      where: {
        OR: cannabisConsumerBasePermissions.map((p) => ({
          type: p.type,
          scope: p.scope,
        })),
      },
    })

    await prisma.role.upsert({
      where: {
        name_type: {
          name: 'Cannabis Consumer Base Role',
          type: 'cannabis_consumer',
        },
      },
      create: {
        name: 'Administrador',
        type: 'cannabis_consumer',
        base: true,
        permissions: {
          connect: cannabisConsumerBasePermission,
        },
      },
      update: {
        name: 'Administrador',
        type: 'cannabis_consumer',
        base: true,
        permissions: {
          connect: cannabisConsumerBasePermission,
        },
      },
    })
  }
}
