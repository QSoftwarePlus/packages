import { DotenvConfigOutput, config } from 'dotenv'
import { parseArgs } from 'node:util'
import { PermissionSeeder } from './seeders/permissions.seeder'
import { RoleSeeder } from './seeders/role.seeder'
import { PrismaClientSeed, generatePrismaClient } from './client'
import { TagSeeder } from './seeders/tag.seeder'
import { AppConfigSeeder } from './seeders/app-config.seeder'
import { ContactBookSeeder } from './seeders/contact-book.seeder'

require('dotenv').config()

config({
  path: '../.env',
})

const options = {
  environment: { type: 'string' },
} as const

export interface Seeder {
  readonly id: string

  seed(prisma: PrismaClientSeed, options?: DotenvConfigOutput): Promise<void>
}

const seeders: Seeder[] = [
  new PermissionSeeder(),
  new RoleSeeder(),
  new TagSeeder(),
  new AppConfigSeeder(),
  new ContactBookSeeder(),
]

const prisma = generatePrismaClient()

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options })

  for (const seeder of seeders) {
    const start = new Date()

    console.log(`seeder ${seeder.id} starting seeder`)

    await seeder.seed(prisma, config())

    const end = new Date()

    console.log(
      `seeder ${seeder.id} executed successfully in ${end.getTime() - start.getTime()
      } ms`,
    )
  }

  if (environment === 'testing') {
  }

  if (environment === 'development') {
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
