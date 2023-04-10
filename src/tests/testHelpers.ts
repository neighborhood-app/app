import { UserWithoutId } from '../types';
import prisma from '../model/prismaClient';

const INITIAL_USER_DATA_WITHOUT_ID: UserWithoutId = {
  user_name: 'johnsmith',
  password_hash: 'password_hash_not_required',
  first_name: null,
  last_name: null,
  dob: null,
  gender_id: null,
  bio: null,
};

const usersInDb = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export default {
  INITIAL_USER_DATA_WITHOUT_ID,
  usersInDb,
};
