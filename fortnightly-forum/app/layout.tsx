import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortnightly Forum",
  description: "A platform for anonymous questions and feedback for All Hands meetings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Banner Image */}
        <div className="w-full bg-white dark:bg-gray-950 shadow-md">
          <div className="max-w-6xl mx-auto h-24 relative">
            <div className="absolute inset-0 flex items-center justify-end pr-16">
              <h2 className="text-4xl font-bold">
                <span className="text-[#0a2342]">Evolve </span>
                <span className="text-[#ff5349]">Exponentially.</span>
              </h2>
            </div>
          </div>
        </div>
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fortnightly Forum</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Submit your anonymous questions for the All Hands meeting
              </p>
              <Navigation />
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
