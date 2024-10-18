"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider.js";
import Navbar from "./components/Navbar.js";
import { SessionProvider } from "next-auth/react";
import MiHeader from "./components/MiHeader.js";
// import '@migov/digital-guidelines-core/dist/digital-guidelines-core/digital-guidelines-core.esm.js';
// import '@migov/digital-guidelines-core/dist/digital-guidelines-core/digital-guidelines-core.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 h-screen flex flex-col`}
        >
          <ThemeProvider>
            <div className="flex-grow flex flex-col h-screen">
              <MiHeader />
              <Navbar />
              <main className="flex-grow flex items-center justify-center">
                {children}
              </main>
              <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner py-4">
                <div className="max-w-7xl mx-auto text-center text-sm">
                  2024 Tuan Nguyen
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
