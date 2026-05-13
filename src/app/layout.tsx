import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "next-themes";

import "@/styles/globals.css";
import "@/styles/katex.min.css";
import Footer from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { ToggleParenthesesProvider } from "@/components/toggle-parentheses";
import { Toaster } from "@/components/ui/toaster";
import { cabinetGrotesk, plex, zodiak } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}`),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  generator: "Next.js",
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  keywords: ["computer science", "mathematics", "blog", "school"],
  openGraph: {
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.name,
    },
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_UK",
    type: "website",
    images: ["images/favicon.png"],
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
    canonical: "./",
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
        <PlausibleProvider
          domain="mkutay.dev"
          customDomain="https://pl.mkutay.dev"
          selfHosted={true}
        />
      </head>
      <body
        className={`${zodiak.variable} ${cabinetGrotesk.variable} ${plex.variable} text-foreground bg-background font-body`}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <main className="flex flex-col min-h-screen">
            <NavBar />
            <ToggleParenthesesProvider defaultOpen={true}>
              <div className="flex-1">{children}</div>
            </ToggleParenthesesProvider>
            <Footer />
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
