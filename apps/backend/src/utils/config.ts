// if (process.env.NODE_ENV !== 'production') {
// 	// eslint-disable-next-line global-require
// 	require('dotenv').config();
// }

import { config } from 'dotenv';

config();

const { DATABASE_URL, PORT, SECRET } = process.env;

export default { DATABASE_URL, PORT, SECRET };
