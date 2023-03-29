import { config } from 'dotenv';

config();

const { DATABASE_URL, PORT } = process.env;

export default { DATABASE_URL, PORT };
