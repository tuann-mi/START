import { Client } from "pg";

export function getDbClient() {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true,
    },
  });
}
