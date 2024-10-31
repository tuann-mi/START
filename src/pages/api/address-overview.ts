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
        WITH address_data AS (
            select distinct
                UPPER(
                    a.street_num || ' ' || 
                    CASE 
                    WHEN a.street_modifier IS NOT NULL AND a.street_modifier != '' 
                    THEN a.street_modifier || ' ' 
                    ELSE '' 
                    END || 
                    a.street_name || ' ' || 
                    a.street_type
                ) as street_address,
                UPPER(a.city) as city,
                UPPER(a.state) as state,
                a.zipcode,
                s.site_name,
                UPPER(tox.first_name || ' ' || tox.last_name) as toxicologist,
                UPPER(eqa.first_name || ' ' || eqa.last_name) as eqa,
                array_agg(p.program_name) as programs,
                a.id as address_id
            from
                site s
                join address_info ai on s.id = ai.site_id
                join address a on ai.address_id = a.id
                join address_program ap on a.id = ap.address_id
                join "program" p on ap.program_id = p.id
                join site_info si on s.id = si.site_id
                join toxicologist tox on si.toxicologist_id = tox.id
                join eqa eqa on si.eqa_id = eqa.id
            group by
                street_address,
                site_name,
                toxicologist,
                eqa,
                a.id
        )
        SELECT 
            ad.*,
            json_agg(DISTINCT jsonb_build_object(
                'name', UPPER(o.first_name || ' ' || o.last_name),
                'email', o.email,
                'phone_number', o.phone_num,
                'mailing_address', UPPER(
                    ma.street_num || ' ' || 
                    CASE 
                    WHEN ma.street_modifier IS NOT NULL AND ma.street_modifier != '' 
                    THEN ma.street_modifier || ' ' 
                    ELSE '' 
                    END || 
                    ma.street_name || ' ' || 
                    ma.street_type
                ),
                'mailing_city', UPPER(ma.city),
                'mailing_state', UPPER(ma.state),
                'mailing_zipcode', ma.zipcode
            )) as owners,
            json_agg(DISTINCT jsonb_build_object(
                'name', UPPER(t.first_name || ' ' || t.last_name),
                'email', t.email,
                'phone_number', t.phone_num,
                'mailing_address', UPPER(
                    tma.street_num || ' ' || 
                    CASE 
                    WHEN tma.street_modifier IS NOT NULL AND tma.street_modifier != '' 
                    THEN tma.street_modifier || ' ' 
                    ELSE '' 
                    END || 
                    tma.street_name || ' ' || 
                    tma.street_type
                ),
                'mailing_city', UPPER(tma.city),
                'mailing_state', UPPER(tma.state),
                'mailing_zipcode', tma.zipcode
            )) as tenants
        FROM 
            address_data ad
            LEFT JOIN owner o ON ad.address_id = o.address_id
            LEFT JOIN mailing_address ma ON o.mailing_address_id = ma.id
            LEFT JOIN tenant t ON ad.address_id = t.address_id
            LEFT JOIN mailing_address tma ON t.mailing_address_id = tma.id
        GROUP BY
            ad.street_address,
            ad.city,
            ad.state,
            ad.zipcode,
            ad.site_name,
            ad.toxicologist,
            ad.eqa,
            ad.programs,
            ad.address_id
        ORDER BY
            ad.street_address;
    `);

    console.log("Full query executed successfully:", result.rows.slice(0, 3));
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  } finally {
    await client.end();
    console.log("Disconnected from the database.", new Date().toLocaleTimeString());
  }
}
