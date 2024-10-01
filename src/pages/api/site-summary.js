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
        select
            ai.street_num || ' ' || ai.street_name as address,
            ai.site_name,
            sd.sample_date,
            l.lab_name,
            a.analyte_name_1 as analyte,
        sd.sample_value
        from
            site_data sd
            join address_info ai on sd.id_address = ai.id_address
            join labs l on sd.id_lab = l.id_lab
            join analytes a on sd.id_analyte = a.id_analyte
        limit
            5;
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