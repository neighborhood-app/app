import { config } from 'dotenv';

config({ path: `${__dirname}/../../.env` });

process.env.POSTGRES_URL = process.env.NODE_ENV === 'development'
  ? process.env.DEV_POSTGRES_URL
  : process.env.TEST_POSTGRES_URL;

export default process.env;
