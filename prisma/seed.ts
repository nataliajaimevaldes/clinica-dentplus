/// <reference types="node" />
import 'dotenv/config'
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { connect } from 'node:http2';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding database...")

    await prisma.affiliate.deleteMany(); // Limpiar tabla antes de insertar nuevos datos

    const affiliates = await Promise.all ([
        prisma.affiliate.create({ data: {
            firstName: "Juan",
            lastName: "Pérez",
            email: "juan.perez@example.com",
            membershipType: "gold"
        }}),
        prisma.affiliate.create({ data: {
            firstName: "María",
            lastName: "Gómez",
            email: "maria.gomez@example.com",
            membershipType: "silver"
        }}),
    ])

    const count = await prisma.affiliate.count()
    console.log(`Seeded ${count} affiliates:`, affiliates);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });