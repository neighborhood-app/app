import bcrypt from 'bcrypt';
import prismaClient from '../prismaClient';

const SAMPLE_PASSWORD = 'secret';

/**
 * Generates a password hash using bcrypt library and 10 salt rounds
 * @param password plain-text password to generate hash
 * @returns Promise resolved to password-hash
 */
const getPasswordHash = async (password: string): Promise<string> => {
  const SALT_ROUNDS = 10;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return Promise.resolve(passwordHash);
};

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

  const bob = await prismaClient.user.create({
    data: {
      user_name: 'bob1234',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const antonina = await prismaClient.user.create({
    data: {
      user_name: 'antonina',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  const shwetank = await prismaClient.user.create({
    data: {
      user_name: 'shwetank',
      password_hash: await getPasswordHash(SAMPLE_PASSWORD),
    },
  });

  // const radu = await prisma.user.create({
  //   data: {
  //     user_name: 'radu',
  //     password_hash: 'example',
  //   },
  // });

  // const mike = await prisma.user.create({
  //   data: {
  //     user_name: 'mike',
  //     password_hash: 'example',
  //   },
  // });

  // const maria = await prisma.user.create({
  //   data: {
  //     user_name: 'maria',
  //     password_hash: 'example',
  //   },
  // });

  const bobNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: bob.id,
      name: "Bob's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(bob.id, bobNeighborhood.id);

  const antoninaNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: antonina.id,
      name: "Antonina's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(antonina.id, antoninaNeighborhood.id);

  const shwetankNeighborhood = await prismaClient.neighborhood.create({
    data: {
      admin_id: shwetank.id,
      name: "Shwetank's Neighborhood",
    },
  });

  await connectUsertoNeighborhood(shwetank.id, shwetankNeighborhood.id);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
