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
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Connected to the database.');

    const result = await client.query(`
        select distinct
            ai.sampled_address_clean,
            si.site_name,
            pi.sampling_type,
            ai.sampling_status,
            ai.date_last_sampled,
            t.name_toxicologist_first || ' ' || t.name_toxicologist_last as toxicologist,
            pm.name_project_manager_first || ' ' || pm.name_project_manager_last as project_manager
        from
            site_info si
            join address_info ai on si.id_site = ai.id_site
            join toxicologists t on ai.id_toxicologist = t.id_toxicologist
            join project_managers pm on ai.id_project_manager = pm.id_project_manager
            join program_info pi on si.id_site = pi.id_site
        order by
            ai.sampled_address_clean;
    `);
    console.log('Full query executed successfully:', result.rows);
    const formattedRows = result.rows.map(row => ({
        ...row,
        date_last_sampled: row.date_last_sampled.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }));
    res.status(200).json(formattedRows);
    console.log('Data type of date_last_sampled:', typeof formattedRows[0].date_last_sampled, formattedRows[0].date_last_sampled);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}