import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    statement_timeout: 60000,
  });

  try {
    console.log('(ADDRESS INFO) Connecting to the database...');
    await client.connect();
    console.log('(ADDRESS INFO) Connected to the database.');

    const result = await client.query(`
        select distinct
            si.site_name,
            pi.sampling_type,
            t.name_toxicologist_first || ' ' || t.name_toxicologist_last as toxicologist,
            pm.name_project_manager_first || ' ' || pm.name_project_manager_last as project_manager,
            ai.sampled_address_clean as address
        from
            site_info si
            join address_info ai on si.id_site = ai.id_site
            join toxicologists t on ai.id_toxicologist = t.id_toxicologist
            join project_managers pm on ai.id_project_manager = pm.id_project_manager
            join program_info pi on si.id_site = pi.id_site;
    `);
    console.log('(ADDRESS INFO) Full query executed successfully:', result.rows.slice(0, 5));
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('(ADDRESS INFO) Error executing query:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  } finally {
    await client.end();
    console.log('(ADDRESS INFO) Disconnected from the database.');
  }
}