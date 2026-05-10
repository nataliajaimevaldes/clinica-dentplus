import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const affiliate = [
  { firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', membershipType: 'gold' as const }
]

async function main() {
  console.log('Seeding database...')

  await prisma.affiliate.createMany({ data: affiliate })

  const count = await prisma.affiliate.count()
  console.log(`Inserted ${count} affiliates.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
