"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Crear usuario de prueba
    const hashedPassword = await (0, bcryptjs_1.hash)('password123', 10);
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            password: hashedPassword
        }
    });
    console.log(`Created user: ${user.email}`);
    // Crear afiliados de prueba
    const affiliates = [
        { firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', membershipType: 'gold', userId: user.id },
        { firstName: 'María', lastName: 'García', email: 'maria.garcia@example.com', membershipType: 'silver', userId: user.id },
        { firstName: 'Carlos', lastName: 'López', email: 'carlos.lopez@example.com', membershipType: 'platinum', userId: user.id }
    ];
    await prisma.affiliate.createMany({ data: affiliates });
    const count = await prisma.affiliate.count();
    console.log(`Inserted ${count} affiliates for user ${user.email}.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
