import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AffiliateModel {
    static async getAll(userId: number) {
        return await prisma.affiliate.findMany({
            where: { userId }
        });
    }   

    static async getById(id: number, userId: number) {
        return await prisma.affiliate.findUnique({
            where: { id },
            include: { user: true }
        });
    }   

    static async create(data: { firstName: string; lastName: string; email: string; membershipType: string }, userId: number) {
        return await prisma.affiliate.create({  
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                membershipType: data.membershipType as "silver" | "gold" | "platinum",
                userId
            }
        });
    }

    static async update(id: number, data: { firstName?: string; lastName?: string; email?: string; membershipType?: string }, userId: number) {
        // Filtrar valores undefined
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        ) as Partial<typeof data>;

        return await prisma.affiliate.update({
            where: { id },
            data: {
                ...(filteredData.firstName && { firstName: filteredData.firstName }),
                ...(filteredData.lastName && { lastName: filteredData.lastName }),
                ...(filteredData.email && { email: filteredData.email }),
                ...(filteredData.membershipType && { membershipType: filteredData.membershipType as "silver" | "gold" | "platinum" })
            }
        });
    }   

    static async delete(id: number, userId: number) {
        return await prisma.affiliate.delete({
            where: { id }
        });
    }
}