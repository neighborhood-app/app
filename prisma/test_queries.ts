import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function testQuery() {
  const result = await prisma.user.findMany({});
  console.log(result);
}

testQuery();
