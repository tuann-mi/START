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
    console.log(new Date().toLocaleTimeString(), "- site-overview.ts - Connecting to the database...");
    await client.connect();
    console.log(new Date().toLocaleTimeString(), "- site-overview.ts - Connected to the database.");
    const query = `SELECT distinct 
          s.site_name,
          t.first_name || ' ' || t.last_name as toxicologist,
          e.first_name || ' ' || e.last_name as eqa
        from
          site s
          join site_info si on s.id = si.site_id
          join toxicologist t on si.toxicologist_id = t.id
          join eqa e on si.eqa_id = e.id
        LIMIT 10;
    `;
    if (process.env.NODE_ENV === "development") {
      console.log(new Date().toLocaleTimeString(), "- site-overview.ts - Query to be executed: ", query);
    }
    const result = await client.query(query);
    console.log(new Date().toLocaleTimeString(), "- site-overview.ts - Full query executed successfully.");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(new Date().toLocaleTimeString(), "- site-overview.ts - Error executing query:", error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  } finally {
    await client.end();
    console.log(new Date().toLocaleTimeString(), "- site-overview.ts - Disconnected from the database.");
  }
}
