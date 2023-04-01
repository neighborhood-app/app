import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  await prisma.neighborhoodUsers.createMany({
    data: [
      {
        neighborhood_id: bobNeighborhood.id,
        user_id: radu.id,
      },
      {
        neighborhood_id: bobNeighborhood.id,
        user_id: maria.id,
      },
    ],
  });
}

export default main;
