import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TranslatedText } from "@/components/language-provider";

export default async function SavedPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          <TranslatedText k="saved.title" />
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <TranslatedText k="saved.subtitle" />
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          <TranslatedText k="saved.emptyPrefix" />{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            <TranslatedText k="saved.browse" />
          </Link>{" "}
          <TranslatedText k="saved.emptySuffix" />
        </p>
      </div>
    </div>
  );
}
