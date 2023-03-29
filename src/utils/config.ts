import { config } from 'dotenv';

config();

const DATABASE_URL = process.env.NODE_ENV === 'development'
  ? process.env.DEV_POSTGRES_URL
  : process.env.TEST_POSTGRES_URL;

const { PORT } = process.env;

export default { DATABASE_URL, PORT };
