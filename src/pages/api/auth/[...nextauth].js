import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/auth/credentials";
import { authConfig } from "@/lib/auth/flags";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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

export default NextAuth({
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (credentials) {
        return true; // Credentials were already verified in authorize()
      }
      if (account?.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@gmail.com");
      }
      return false;
    },
  },
});
