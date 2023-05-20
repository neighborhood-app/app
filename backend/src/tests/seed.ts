import prismaClient from '../../prismaClient';
import testHelpers from './testHelpers';

const SAMPLE_PASSWORD = 'secret';

/**
 * connects user to neighborhood in the db
 * @param userId
 * @param neighborhoodId
 */
const connectUsertoNeighborhood = async (userId: number, neighborhoodId: number): Promise<void> => {
  await prismaClient.neighborhood.update({
    where: { id: neighborhoodId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
};

async function main() {
  // clearing the existing db
  await testHelpers.removeAllData();

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
      user_name: 'bob1234',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      user_name: 'antonina',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      user_name: 'shwetank',
      password_hash: await testHelpers.getPasswordHash(SAMPLE_PASSWORD),
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
  const bobsNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  connectUsertoNeighborhood(bob.id, bobsNeighborhood.id);

  const antoninasNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  connectUsertoNeighborhood(antonina.id, antoninasNeighborhood.id);

  const shwetanksNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  connectUsertoNeighborhood(shwetank.id, shwetanksNeighborhood.id);

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
