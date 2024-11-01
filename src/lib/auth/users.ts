import { getDbClient } from "@/lib/db/client";

export interface User {
  id: number;
  user_group: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  username: string;
  email: string;
  password: string;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const client = getDbClient();

  try {
    await client.connect();
    const result = await client.query(`SELECT * FROM "user" WHERE username = $1`, [username]);

    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  } finally {
    await client.end();
  }
}
