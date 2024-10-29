import { Client } from "pg";

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    statement_timeout: 60000,
  });

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected to the database.");

    const result = await client.query(`
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
            s.site_name,
            tox.first_name || ' ' || tox.last_name as toxicologist,
            eqa.first_name || ' ' || eqa.last_name as eqa,
            array_agg(p.program_name) as programs
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
            ap.address_id
        order by
            street_address;
    `);
    console.log("Full query executed successfully:", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing query:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data", details: error.message });
  } finally {
    await client.end();
    console.log("Disconnected from the database.");
  }
}
