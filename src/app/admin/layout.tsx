import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    await auth.protect();
  }

  const user = await currentUser();
  const allowed =
    user?.emailAddresses.some((addr) => isAdminEmail(addr.emailAddress)) ??
    false;

  if (!allowed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-900/50 dark:bg-red-950/30">
          <h1 className="text-xl font-bold text-red-700 dark:text-red-400">
            Access Denied (403)
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This admin area is restricted to the site owner only.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to News Feed
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
