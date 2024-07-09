import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from '@/components/navBar';
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import '@/public/css/katex.min.css';
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 1;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}`),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  generator: 'Next.js',
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  authors: [{ name: 'Mehmet Kutay Bozkurt', url: 'https://www.mkutay.dev' }],
  creator: 'Mehmet Kutay Bozkurt',
  publisher: 'Mehmet Kutay Bozkurt',
  keywords: ['computer science', 'mathematics', 'personal blog'],
  openGraph: {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en_UK',
    type: 'website',
    images: ['images/favicon.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': 'https://mkutay.dev/feed.xml',
    },
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
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
