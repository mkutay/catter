import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import PlausibleProvider from 'next-plausible'

import '@/styles/globals.css';
import '@/styles/katex.min.css';
import { Toaster } from '@/components/ui/toaster';
import NavBar from '@/components/navBar';
import Footer from '@/components/footer';
import { siteConfig } from '@/config/site';
import { plex, zodiak } from '@/config/fonts';

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
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: ['computer science', 'mathematics', 'blog', 'school'],
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
      'application/rss+xml': `${siteConfig.url}/feed.xml`,
    },
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="mkutay.dev" customDomain="https://pl.mkutay.dev" selfHosted={true} />
      </head>
      <body className={`${zodiak.variable} ${plex.variable} text-foreground bg-background font-body`}>
        <ThemeProvider attribute="class">
          <main className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
