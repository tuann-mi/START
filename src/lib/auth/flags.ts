type AuthMode = "none" | "credentials" | "google" | "all";

interface AuthConfig {
  mode: AuthMode;
  protectedPaths: string[];
  publicPaths: string[];
}

export const authConfig: AuthConfig = {
  mode: (process.env.NEXT_PUBLIC_AUTH_MODE as AuthMode) || "all",
  protectedPaths: ["/", "/dashboard", "/calendar", "/upload", "/profile"],
  publicPaths: ["/login", "/api/auth"],
};

export function isProtectedPath(path: string): boolean {
  if (authConfig.mode === "none") return false;

  const isPublic = authConfig.publicPaths.some((p) => path.startsWith(p));
  if (isPublic) return false;

  return authConfig.protectedPaths.some((p) => path.startsWith(p));
}
