import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex-provider";
import NextAuthSessionProvider from "@/components/auth/SessionProvider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import { RealTimeProvider } from "@/components/real-time/RealTimeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YourJob - AI-Powered Job Portal",
  description: "Track your job applications, analyze your resume with AI, and land your dream job.",
  keywords: "job portal, resume analysis, AI, job tracking, career",
  authors: [{ name: "YourJob Team" }],
  viewport: "width=device-width, initial-scale=1",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YourJob",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourjob.com",
    title: "YourJob - AI-Powered Job Portal",
    description: "Track your job applications, analyze your resume with AI, and land your dream job.",
    siteName: "YourJob",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourJob - AI-Powered Job Portal",
    description: "Track your job applications, analyze your resume with AI, and land your dream job.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <NextAuthSessionProvider>
            <AuthProvider>
              <RealTimeProvider />
              {children}
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            </AuthProvider>
          </NextAuthSessionProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
