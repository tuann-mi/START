import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // This is necessary if you're using a self-signed certificate
    },
    statement_timeout: 60000,
  });

  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Connected to the database.');

    // Full query with type casting
    const result = await client.query(`
        SELECT
            ai.street_num || ' ' || ai.street_name || ' ' || ai.street_type as address,
            wo.workorder_type,
            wo.workorder_status,
            ai.site_name,
            wo.workorder_scheduled_date,
            wo.workorder_completed_date,
            wo.workorder_record_created_by,
            pi.sampling_year,
            si.lab_name,
            pi.sampling_eligibility,
            pi.sampling_round
        FROM
            work_orders wo
            LEFT JOIN address_info ai ON wo.id_address::bigint = ai.id_address::bigint
            LEFT JOIN program_info pi ON ai.id_address = pi.id_address
            LEFT JOIN site_info_sampling si ON ai.id_site::bigint = si.id_site::bigint
        LIMIT 5;
    `);
    console.log('Full query executed successfully:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}