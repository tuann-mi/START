import { getUserByUsername } from "@/lib/auth/users";
import bcrypt from "bcrypt";

export type UserCredentials = {
  username: string;
  password: string;
};

export async function verifyCredentials(credentials: UserCredentials) {
  try {
    const user = await getUserByUsername(credentials.username);
    console.log("User found:", user ? "yes" : "no");

    if (!user) {
      console.log("No user found with username:", credentials.username);
      return null;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("pw:", credentials.password);
    }
    const isValid = await bcrypt.compare(credentials.password, user.password);
    console.log("Password valid:", isValid);

    if (!isValid) {
      console.log("Invalid password for user:", credentials.username);
      return null;
    }

    return {
      id: user.id.toString(),
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.user_group,
    };
  } catch (error) {
    console.error("Error in verifyCredentials:", error);
    return null;
  }
}
