import { User } from '@prisma/client';

export type UserWithoutPasswordHash = Omit<User, 'password_hash'>;
