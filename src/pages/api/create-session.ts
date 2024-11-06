import { cookies } from "next/headers";
import { getDbClient } from "@/lib/db/client";
import bcrypt from "bcrypt";

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const client = getDbClient();
  try {
    try {
      await client.connect();
      console.log("Connected to database");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
    const data = await client.query(
      `
        INSERT INTO sessions (user_id, expires_at)
        VALUES ($1, $2)
        RETURNING id
        `,
      [id, expiresAt],
    );
    const sessionId = data.rows[0].id;
    console.log("Returned Session ID:", sessionId);

    const session = await bcrypt.hash(sessionId.toString(), 10);
    console.log("Encrypted Session:", session);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Error creating session:", error);
  } finally {
    await client.end();
  }
}
