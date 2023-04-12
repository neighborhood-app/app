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
      password_hash: 'example',
    },
  });

  // const antonina = await prisma.user.create({
  //   data: {
  //     user_name: 'antonina',
  //     password_hash: 'example',
  //   },
  // });

  // const shwetank = await prisma.user.create({
  //   data: {
  //     user_name: 'shwetank',
  //     password_hash: 'example',
  //   },
  // });

  const radu = await prisma.user.create({
    data: {
      user_name: 'radu',
      password_hash: 'example',
    },
  });

  // const mike = await prisma.user.create({
  //   data: {
  //     user_name: 'mike',
  //     password_hash: 'example',
  //   },
  // });

  const maria = await prisma.user.create({
    data: {
      user_name: 'maria',
      password_hash: 'example',
    },
  });

  const bobNeighborhood = await prisma.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  // const antoninaNeighborhood = await prisma.neighborhood.create({
  //   data: {
  //     admin_id: antonina.id,
  //     name: "Antonina's Neighborhood",
  //   },
  // });

  // const shwetankNeighborhood = await prisma.neighborhood.create({
  //   data: {
  //     admin_id: shwetank.id,
  //     name: "Shwetank's Neighborhood",
  //   },
  // });

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
