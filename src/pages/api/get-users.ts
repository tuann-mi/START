import { getDbClient } from "@/lib/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const corsMiddleware = initMiddleware(
  cors({
    origin: [
      "https://start-prod.vercel.app",
      "https://start-git-db-query-rewrite-tuan-nguyens-projects-5f98c417.vercel.app",
      process.env.NEXT_PUBLIC_API_URL,
    ],
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);
  const client = getDbClient();

  try {
    console.log(new Date().toLocaleTimeString(), "- get-users.ts - Connecting to the database...");
    await client.connect();
    console.log(new Date().toLocaleTimeString(), "- get-users.ts - Connected to the database.");
    try {
      const result = await client.query('SELECT * from "user"');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error(new Date().toLocaleTimeString(), "- get-users.ts - Error executing query:", error);
    } finally {
      await client.end();
      console.log(new Date().toLocaleTimeString(), "- get-users.ts - Disconnected from the database.");
    }
  } catch (error) {
    console.error(new Date().toLocaleTimeString(), "- get-users.ts - Error connecting to the database:", error);
  }
}
