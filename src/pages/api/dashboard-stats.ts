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
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    ],
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await corsMiddleware(req, res);
  const client = getDbClient();

  try {
    console.log(new Date().toLocaleTimeString(), " - dashboard-stats.ts - Connecting to the database...");
    await client.connect();
    console.log(new Date().toLocaleTimeString(), " - dashboard-stats.ts - Connected to the database.");
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
          'labels', ARRAY['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          'data', ARRAY_AGG(COALESCE(sample_count, 0) ORDER BY month_number),
          'years', (SELECT ARRAY_AGG(DISTINCT EXTRACT(YEAR FROM sample_date) ORDER BY EXTRACT(YEAR FROM sample_date)) FROM site_data)
        ) FROM (
          SELECT 
            m.month_number,
            COUNT(sd.sample_date) as sample_count
          FROM (
            SELECT generate_series(1,12) as month_number
          ) m 
          LEFT JOIN site_data sd ON EXTRACT(MONTH FROM sd.sample_date) = m.month_number
          GROUP BY m.month_number
          ORDER BY m.month_number
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

    console.log(new Date().toLocaleTimeString(), " - dashboard-stats.ts - Full query executed successfully.");
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  } finally {
    await client.end();
    console.log(new Date().toLocaleTimeString(), " - dashboard-stats.ts - Disconnected from the database.");
  }
}
