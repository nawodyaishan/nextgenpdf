import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

let dbUrl: string | undefined = process.env.NEXT_PUBLIC_DB_URL;

if (!dbUrl) {
  throw new Error('Database URL is missing');
}

const postgresSql = neon(dbUrl);

export const db = drizzle(postgresSql);
