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
    console.log("Connecting to the database...", new Date().toLocaleTimeString());
    await client.connect();
    console.log("Connected to the database.", new Date().toLocaleTimeString());
    const result = await client.query(`
      SELECT 
        (SELECT COUNT(DISTINCT id) FROM site) as "totalSites",
        (SELECT COUNT(*) FROM address) as "totalAddresses", 
        (SELECT COUNT(*) FROM site_data) as "totalSamples",
        (SELECT COUNT(DISTINCT program_id) FROM address_program) as "activePrograms",
        
        (SELECT json_build_object(
          'labels', ARRAY_AGG(program_name ORDER BY address_count DESC),
          'data', ARRAY_AGG(address_count ORDER BY address_count DESC)
        ) FROM (
          SELECT 
            p.program_name,
            COUNT(DISTINCT ap.address_id) as address_count
          FROM address_program ap
          JOIN program p ON p.id = ap.program_id
          GROUP BY p.program_name
          ORDER BY address_count DESC
          LIMIT 5
        ) top_programs) as "addressesByProgram",
        
        (SELECT json_build_object(
          'labels', ARRAY_AGG(month_name),
          'data', ARRAY_AGG(sample_count)
        ) FROM (
          SELECT 
            TO_CHAR(sample_date, 'Mon') as month_name,
            COUNT(*) as sample_count
          FROM site_data
          GROUP BY TO_CHAR(sample_date, 'Mon'), DATE_TRUNC('month', sample_date)
          ORDER BY DATE_TRUNC('month', sample_date) DESC
          LIMIT 3
        ) months) as "samplesByMonth",
        
        (SELECT json_build_object(
          'labels', ARRAY_AGG(analyte_group),
          'data', ARRAY_AGG(analyte_count)
        ) FROM (
          SELECT 
            a.Analyte_Group as analyte_group,
            COUNT(*) as analyte_count
          FROM site_data sd
          JOIN analyte a ON a.id = sd.analyte_id
          GROUP BY a.Analyte_Group
          ORDER BY analyte_count DESC
          LIMIT 5
        ) analytes) as "analyteDistribution"
    `);

    const stats = {
      overview: {
        totalSites: result.rows[0].totalSites,
        totalAddresses: result.rows[0].totalAddresses,
        totalSamples: result.rows[0].totalSamples,
        activePrograms: result.rows[0].activePrograms,
      },
      addressesByProgram: result.rows[0].addressesByProgram,
      samplesByMonth: result.rows[0].samplesByMonth,
      analyteDistribution: result.rows[0].analyteDistribution,
    };
    console.log(stats);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
}
