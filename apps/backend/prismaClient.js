"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// No need to log query while running tests
const prismaClient = process.env.NODE_ENV !== 'test'
    ? new client_1.PrismaClient({ log: ['query'] })
    : new client_1.PrismaClient();
exports.default = prismaClient;
