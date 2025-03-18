import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadGenuis AI - OpenAI-Powered Lead Generator",
  description: "AI-powered lead information generator using OpenAI's search capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="py-4 border-b border-gray-200 bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-center">Lead Scraper</h1>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
