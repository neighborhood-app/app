import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  await prisma.gender.createMany({
    data: [
      {
        name: 'male',
      },
      {
        name: 'female',
      },
    ],
  });

  const bob = await prisma.user.create({
    data: {
      user_name: 'bob',
      password: 'example',
    },
  });

  const antonina = await prisma.user.create({
    data: {
      user_name: 'antonina',
      password: 'example',
    },
  });

  const shwetank = await prisma.user.create({
    data: {
      user_name: 'shwetank',
      password: 'example',
    },
  });

  const radu = await prisma.user.create({
    data: {
      user_name: 'radu',
      password: 'example',
    },
  });

  const mike = await prisma.user.create({
    data: {
      user_name: 'mike',
      password: 'example',
    },
  });

  const maria = await prisma.user.create({
    data: {
      user_name: 'maria',
      password: 'example',
    },
  });

  const bobNeighborhood = await prisma.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  const antoninaNeighborhood = await prisma.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  const shwetankNeighborhood = await prisma.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await prisma.neighborhood.update({
    where: { id: bobNeighborhood.id },
    data: {
      users: {
        connect: [{ id: radu.id }, { id: maria.id }],
      },
    },
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
