import { PrismaClient } from '@prisma/client';

// No need to log query while running tests
const prisma = process.env.NODE_ENV !== 'test'
  ? new PrismaClient({ log: ['query'] })
  : new PrismaClient();

export default prisma;
