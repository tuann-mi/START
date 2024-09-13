import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from './components/ThemeProvider.js'
import Navbar from './components/Navbar.js'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CRM App',
  description: 'Prototype CRM app by Tuan Nguyen',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
              <div className="max-w-7xl mx-auto text-center text-sm">
                 2024 Tuan Nguyen
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}