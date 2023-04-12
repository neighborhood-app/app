import prismaClient from '../../prismaClient';
import testHelpers from './testHelpers';

const SAMPLE_PASSWORD = 'secret';

async function main() {
  // clearing the existing db
  await prismaClient.user.deleteMany({});
  await prismaClient.neighborhood.deleteMany({});
  await prismaClient.neighborhoodUsers.deleteMany({});
  await prismaClient.gender.deleteMany({});
  await prismaClient.request.deleteMany({});
  await prismaClient.request.deleteMany({});

  // same password for all users
  const passwordHashForSamplePassword = await testHelpers.getPasswordHash(SAMPLE_PASSWORD);

  await prismaClient.gender.createMany({
    data: [
      {
        name: 'male',
      },
      {
        name: 'female',
      },
    ],
  });

  // creating users with same password for seeding the db
  const bob = await prismaClient.user.create({
    data: {
      user_name: 'bob',
      password_hash: passwordHashForSamplePassword,
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      user_name: 'antonina',
      password_hash: passwordHashForSamplePassword,
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      user_name: 'shwetank',
      password_hash: passwordHashForSamplePassword,
    },
  });

  // const radu = await prismaClient.user.create({
  //   data: {
  //     user_name: 'radu',
  //     password_hash: passwordHashForSamplePassword,
  //   },
  // });

  // const mike = await prismaClient.user.create({
  //   data: {
  //     user_name: 'mike',
  //     password_hash: passwordHashForSamplePassword,
  //   },
  // });

  // const maria = await prismaClient.user.create({
  //   data: {
  //     user_name: 'maria',
  //     password_hash: passwordHashForSamplePassword,
  //   },
  // });

  // creating neighborhood for seeding db
  await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  await prismaClient.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  // await prisma.neighborhoodUsers.createMany({
  //   data: [
  //     {
  //       neighborhood_id: bobNeighborhood.id,
  //       user_id: radu.id,
  //     },
  //     {
  //       neighborhood_id: bobNeighborhood.id,
  //       user_id: maria.id,
  //     },
  //   ],
  // });
}

export default main;
