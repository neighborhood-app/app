import { UserWithoutId } from '../types';

const USER_WITHOUT_ID: UserWithoutId = {
  user_name: 'johnsmith',
  password_hash: 'password_hash_not_required',
  first_name: null,
  last_name: null,
  dob: null,
  gender_id: null,
  bio: null,
};

export default {
  USER_WITHOUT_ID,
};
