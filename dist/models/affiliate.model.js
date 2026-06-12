import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AffiliateModel {
    static async getAll(userId) {
        return await prisma.affiliate.findMany({
            where: { userId }
        });
    }
    static async getById(id, userId) {
        return await prisma.affiliate.findUnique({
            where: { id },
            include: { user: true }
        });
    }
    static async create(data, userId) {
        return await prisma.affiliate.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                membershipType: data.membershipType,
                userId
            }
        });
    }
    static async update(id, data, userId) {
        // Filtrar valores undefined
        const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
        return await prisma.affiliate.update({
            where: { id },
            data: {
                ...(filteredData.firstName && { firstName: filteredData.firstName }),
                ...(filteredData.lastName && { lastName: filteredData.lastName }),
                ...(filteredData.email && { email: filteredData.email }),
                ...(filteredData.membershipType && { membershipType: filteredData.membershipType })
            }
        });
    }
    static async delete(id, userId) {
        return await prisma.affiliate.delete({
            where: { id }
        });
    }
}
