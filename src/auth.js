import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import verifyCredentials from "@/lib/auth/verify-credentials";
import { authConfig } from "@/lib/auth/flags";
import Credentials from "next-auth/providers/credentials";
import { createSession } from "@/pages/api/create-session";
const providers = [];

if (authConfig.mode === "all" || authConfig.mode === "google") {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  );
}

if (authConfig.mode === "all" || authConfig.mode === "credentials") {
  providers.push(
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const user = await verifyCredentials({
          username: credentials.username,
          password: credentials.password,
        });
        return user;
      },
    }),
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (credentials) {
        const user = await verifyCredentials(credentials);
        if (user) {
          await createSession(user.id);
        }
        return true;
      }
      if (account?.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@gmail.com");
      }
      return false;
    },
  },
});

export { auth as middleware } from "@/auth";
