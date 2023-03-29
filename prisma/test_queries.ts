import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function testQuery() {
  const result = await prisma.user.findMany({});
  console.log(result);
}

async function testInsertUser() {
  const result = await prisma.user.create({
    data: {
      userName: 'test',
      password: 'test',
    },
  });

  console.log(result);
}

testInsertUser();
