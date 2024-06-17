import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from '@/app/ui/navBar';
import Footer from "@/app/ui/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Kutay\'s Blog',
  description: 'A blog where uni student Kutay posts about things he likes, from maths to computer science',
  generator: 'Next.js',
  applicationName: 'Next.js',
  authors: [{ name: 'Mehmet Kutay Bozkurt', url: 'https://www.mkutay.dev' }],
  creator: 'Mehmet Kutay Bozkurt',
  openGraph: {
    title: 'Kutay\'s Blog',
    description: 'A blog where uni student Kutay posts about things he likes, from maths to computer science',
    url: 'https://www.mkutay.dev',
    siteName: 'Kutay\'s Blog',
    locale: 'en_UK',
    type: 'website',
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://mkutay.dev/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} text-[#4c4f69] bg-[#eff1f5] dark:text-[#cdd6f4] dark:bg-[#1e1e2e]`}>
        <ThemeProvider attribute="class">
          <main className="flex flex-col min-h-screen divide-y divide-[#ccd0da] dark:divide-[#313244]">
            <div><NavBar/></div>
            <div className="flex-1">{children}</div>
            <div><Footer/></div>
          </main>
        </ThemeProvider>
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
