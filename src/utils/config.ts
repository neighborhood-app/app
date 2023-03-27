import { config } from 'dotenv';

config();

const POSTGRES_URL = process.env.NODE_ENV === 'development'
  ? process.env.DEV_POSTGRES_URL
  : process.env.TEST_POSTGRES_URL;

const PORT = process.env.PORT;

export default { POSTGRES_URL, PORT };
