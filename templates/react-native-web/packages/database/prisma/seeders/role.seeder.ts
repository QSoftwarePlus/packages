import { Seeder } from 'prisma/seed'
import {
  cannabisConsumerBasePermissions,
  doctorBasePermissions,
} from './permissions.seeder'
import { PrismaClientSeed } from '../client'

export class RoleSeeder implements Seeder {
  readonly id: string = 'role-seeder-v1'

  async seed(prisma: PrismaClientSeed): Promise<void> {
    const doctorPermissions = await prisma.permission.findMany({
      where: {
        OR: doctorBasePermissions.map((p) => ({
          type: p.type,
          scope: p.scope,
        })),
      },
    })

    await prisma.role.upsert({
      where: {
        name_type: {
          name: 'Doctor',
          type: 'doctor',
        },
      },
      create: {
        name: 'Doctor',
        type: 'doctor',
        base: true,
        permissions: {
          connect: doctorPermissions,
        },
      },
      update: {
        name: 'Doctor',
        type: 'doctor',
        base: true,
        permissions: {
          connect: doctorPermissions,
        },
      },
    })

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
          name: 'Administrador',
          type: 'default_user',
        },
      },
      create: {
        name: 'Administrador',
        type: 'default_user',
        base: true,
        permissions: {
          connect: cannabisConsumerBasePermission,
        },
      },
      update: {
        name: 'Administrador',
        type: 'default_user',
        base: true,
        permissions: {
          connect: cannabisConsumerBasePermission,
        },
      },
    })
  }
}
