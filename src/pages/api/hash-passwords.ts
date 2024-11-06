import { getDbClient } from "@/lib/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import cors from "cors";
import bcrypt from "bcrypt";
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
  const saltRounds = 12;
  try {
    console.log("Connecting to the database...", new Date().toLocaleTimeString());
    await client.connect();
    console.log("Connected to the database.", new Date().toLocaleTimeString());

    const result = await client.query('SELECT id, password FROM "user"');
    console.log(`Found ${result.rows.length} users to process`);

    try {
      for (const user of result.rows) {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        await client.query('UPDATE "user" SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
        console.log(`Updated password for user ID: ${user.id}`);
      }

      console.log("All passwords have been hashed");
    } catch (error) {
      console.error("Error hashing passwords:", error);
    }
    res.status(200).json({ message: "Passwords hashed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  } finally {
    await client.end();
    console.log("Disconnected from the database.", new Date().toLocaleTimeString());
  }
}
