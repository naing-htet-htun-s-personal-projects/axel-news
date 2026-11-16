import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@/lib/clerk-provider";
import { PostHogProvider } from "@/lib/posthog";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { LanguageProvider } from "@/components/language-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansMyanmar = Noto_Sans_Myanmar({
  variable: "--font-myanmar",
  subsets: ["myanmar"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Axel News — Myanmar IT News",
  description:
    "Myanmar IT news aggregation and enrichment platform. Free, open, and AI-powered.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Axel News",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} ${notoSansMyanmar.variable} h-full antialiased`}
        >
          <body
            className="min-h-full flex flex-col bg-gray-50 font-sans dark:bg-gray-950"
            suppressHydrationWarning
          >
            <LanguageProvider>
              <ServiceWorkerRegistration />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </LanguageProvider>
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  );
}
