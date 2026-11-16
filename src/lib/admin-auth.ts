import { currentUser } from "@clerk/nextjs/server";

export const ADMIN_EMAIL = "axel8102005@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}

export async function requireAdmin(): Promise<
  | { ok: true; userId: string; email: string }
  | { ok: false; status: 401 | 403; error: string }
> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const hasAdminEmail = user.emailAddresses.some((addr) =>
    isAdminEmail(addr.emailAddress)
  );

  if (!hasAdminEmail) {
    return { ok: false, status: 403, error: "Forbidden: Admin access only" };
  }

  return { ok: true, userId: user.id, email: ADMIN_EMAIL };
}
