import prisma from '../lib/prisma.js';
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};
export const createUser = async (email, password) => {
    return await prisma.user.create({
        data: {
            email,
            password
        }
    });
};
export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id }
    });
};
