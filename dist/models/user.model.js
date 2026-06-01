"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.createUser = exports.findUserByEmail = void 0;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const findUserByEmail = async (email) => {
    return await prisma_js_1.default.user.findUnique({
        where: { email }
    });
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (email, password) => {
    return await prisma_js_1.default.user.create({
        data: {
            email,
            password
        }
    });
};
exports.createUser = createUser;
const getUserById = async (id) => {
    return await prisma_js_1.default.user.findUnique({
        where: { id }
    });
};
exports.getUserById = getUserById;
