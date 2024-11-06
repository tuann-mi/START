import { getDbClient } from "@/lib/db/client";
import { User } from "@/lib/types";

export async function getUserByUsername(username: string): Promise<User | null> {
  const client = getDbClient();

  try {
    await client.connect();
    const result = await client.query(`SELECT * FROM "user" WHERE username = $1`, [username]);
    console.log("User found:", result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  } finally {
    await client.end();
  }
}
