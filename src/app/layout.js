"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ui/ThemeProvider.js";
import Navbar from "@/components/ui/Navbar.js";
import { SessionProvider } from "next-auth/react";
import MiHeader from "@/components/ui/MiHeader.js";
import Providers from "./providers";
// import '@migov/digital-guidelines-core/dist/digital-guidelines-core/digital-guidelines-core.esm.js';
// import '@migov/digital-guidelines-core/dist/digital-guidelines-core/digital-guidelines-core.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  console.log(process.env.NODE_ENV);
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 h-screen flex flex-col `}
        >
          <ThemeProvider>
            <Providers>
              <MiHeader />
              <Navbar />
              <div className="flex-grow flex flex-col h-screen">
                <main className="flex-grow flex items-center justify-center">
                  {children}
                </main>
                <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner py-4">
                  <div className="max-w-7xl mx-auto text-center text-sm">
                    <span>2024 Tuan Nguyen</span>
                    <span className="mx-2">|</span>
                    <span>version {process.env.NEXT_PUBLIC_VERSION}</span>
                    {process.env.NODE_ENV === "development" && (
                      <>
                        <span className="mx-2">|</span>
                        <span className="text-red-500">dev mode</span>
                      </>
                    )}
                  </div>
                </footer>
              </div>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
