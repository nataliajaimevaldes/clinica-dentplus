import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Crear usuario de prueba
  const hashedPassword = await hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword
    }
  })

  console.log(`Created user: ${user.email}`)

  // Crear afiliados de prueba
  const affiliates = [
    { firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', membershipType: 'gold' as const, userId: user.id },
    { firstName: 'María', lastName: 'García', email: 'maria.garcia@example.com', membershipType: 'silver' as const, userId: user.id },
    { firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@example.com', membershipType: 'platinum' as const, userId: user.id }
  ]

  await prisma.affiliate.createMany({ data: affiliates })

  const count = await prisma.affiliate.count()
  console.log(`Inserted ${count} affiliates for user ${user.email}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
