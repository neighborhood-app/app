import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  await prisma.user.deleteMany({});
  await prisma.neighborhood.deleteMany({});
  await prisma.neighborhoodUsers.deleteMany({});
  await prisma.gender.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.request.deleteMany({});

  await prisma.gender.createMany({
    data: [
      {
        id: 1,
        name: 'male',
      },
      {
        id: 2,
        name: 'female',
      },
    ],
  });

  const bob = await prisma.user.create({
    data: {
      userName: 'bob',
      password: 'example',
    },
  });

  const antonina = await prisma.user.create({
    data: {
      userName: 'antonina',
      password: 'example',
    },
  });

  const shwetank = await prisma.user.create({
    data: {
      userName: 'shwetank',
      password: 'example',
    },
  });

  const radu = await prisma.user.create({
    data: {
      userName: 'radu',
      password: 'example',
    },
  });

  const mike = await prisma.user.create({
    data: {
      userName: 'mike',
      password: 'example',
    },
  });

  const maria = await prisma.user.create({
    data: {
      userName: 'maria',
      password: 'example',
    },
  });

  const bobNeighborhood = await prisma.neighborhood.create({
    data: {
      adminID: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  const antoninaNeighborhood = await prisma.neighborhood.create({
    data: {
      adminID: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  const shwetankNeighborhood = await prisma.neighborhood.create({
    data: {
      adminID: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await prisma.neighborhoodUsers.createMany({
    data: [
      {
        neighborhoodID: bobNeighborhood.id,
        userID: radu.id,
      },
      {
        neighborhoodID: bobNeighborhood.id,
        userID: maria.id,
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
