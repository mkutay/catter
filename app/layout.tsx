import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavBar from '@/app/ui/navBar';
import Footer from "@/app/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kutay's Blog",
  description: "A blog where uni student Kutay posts about things he likes, from maths to computer science",
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
            <div>{children}</div>
            <div><Footer/></div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
