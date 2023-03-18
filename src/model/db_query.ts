import { Client } from 'pg';
import config from '../utils/config';

// should be moved to logger module
const logQuery = (statement: string, parameters: string[]) => {
  const timeStamp = new Date();
  const formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

export default async function dbQuery(
  statement: string,
  ...parameters: string[]
) {
  const client = new Client(config.POSTGRES_URL);

  await client.connect();
  logQuery(statement, parameters);
  const result = await client.query(statement, parameters);
  await client.end();

  return result;
}
