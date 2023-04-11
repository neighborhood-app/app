import { config } from 'dotenv';

config();

const { DATABASE_URL, PORT, SECRET } = process.env;

export default { DATABASE_URL, PORT, SECRET };
