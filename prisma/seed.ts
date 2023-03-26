import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        userName: 'bob',
        password: 'example',
      },
      {
        userName: 'antonina',
        password: 'example',
      },
      {
        userName: 'shwetank',
        password: 'example',
      },
      {
        userName: 'radu',
        password: 'example',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
