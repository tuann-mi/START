"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authConfig } from "@/lib/auth/flags";
import { PageHeader } from "@/components/ui/headers";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const validatedCredentials = loginSchema.safeParse(credentials);
      if (!validatedCredentials.success) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }
      const callbackUrl = searchParams?.get("callbackUrl") || "/";
      const result = await signIn("credentials", {
        username: validatedCredentials.data.username,
        password: validatedCredentials.data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const showCredentials = authConfig.mode === "all" || authConfig.mode === "credentials";
  const showGoogle = authConfig.mode === "all" || authConfig.mode === "google";

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-md p-8 rounded-lg max-w-md w-full">
        <PageHeader title="Sign in to your account" />

        {searchParams?.get("message") && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p>{searchParams.get("message")}</p>
          </div>
        )}

        {showCredentials && (
          <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-4">
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-som-primary text-white p-2 hover:underline rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner className="flex items-center justify-center" /> : "Sign in with Credentials"}
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
