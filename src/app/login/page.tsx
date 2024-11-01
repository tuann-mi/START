"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authConfig } from "@/lib/auth/flags";
import { PageHeader } from "@/components/ui/headers";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  const showCredentials = authConfig.mode === "all" || authConfig.mode === "credentials";
  const showGoogle = authConfig.mode === "all" || authConfig.mode === "google";

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-md p-8 rounded-lg max-w-md w-full">
        <PageHeader title="Sign in to your account" />

        {showCredentials && (
          <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Sign in with Credentials
            </button>
          </form>
        )}

        {showGoogle && (
          <button
            onClick={() => signIn("google")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out w-full"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
