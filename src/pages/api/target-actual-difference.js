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

    // Test query to check the connection
    const testResult = await client.query('SELECT NOW()');
    console.log('Test query executed successfully:', testResult.rows);

    // Full query
    const result = await client.query(`
      SELECT 
        si.site_name,
        si.num_homes_sampled_target AS target,
        si.num_homes_sampled_actual AS actual,
        (si.num_homes_sampled_actual - si.num_homes_sampled_target) AS difference
      FROM 
        site_info_sampling si
    `);
    console.log('Full query executed successfully:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    await client.end();
    console.log('Disconnected from the database.');
  }
}