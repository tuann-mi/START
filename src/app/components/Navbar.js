import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useTheme } from './ThemeProvider';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch"

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Upload', href: '/upload' },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-sm w-full sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div id="navbar-left" className="flex">

            {/* <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
                MiEHCOS
              </Link>
            </div> */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-som-primary text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-100'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div id="navbar-right" className="flex items-center relative">
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            {session ? (
              <>
                <button 
                  onClick={toggleDropdown} 
                  className="hidden sm:flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200 min-h-3.5"
                >
                  <span className="border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium mx-2">{session.user.name}</span>
                  <Image
                    src={session.user.image || '/default_pfp.png'} // CHANGE LATER
                    alt="User Profile"
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                </button>
                {dropdownOpen && (
                  <div className="mt-40 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 absolute right-0">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
              <button onClick={() => signIn('google', { callbackUrl: '/' })} className="hidden sm:flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200">
                <Link
                  href="/login"
                  className={`border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium mx-2`}
                >
                  Login
                </Link>
                <Image
                  src={'/default_pfp.png'} // CHANGE LATER
                  alt="User Profile"
                  className="w-8 h-8 rounded-full mx-2"
                  width={32}
                  height={32}
                /> 
              </button>
              </>
            )}
            
            <div className="hidden sm:flex items-center ml-2">
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={() => {toggleTheme(); console.log("Theme set to: ", theme);}}
              />
              <span className="ml-2">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>
            {/* <button
              onClick={() => {toggleTheme(); console.log("Theme set to: ", theme);}}
              className="hidden sm:block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-200"
            >
              {theme === 'dark' ? 'Set to light-mode' : 'Set to dark-mode'}
            </button> */}
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {item.name}
              </Link>
            ))}
            {session ? (
              <>
                <button
                  onClick={() => {toggleTheme(); console.log("Theme set to: ", theme);}}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-200"
                >
                  {theme === 'dark' ? 'Set to light-mode' : 'Set to dark-mode'}
                </button>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={() => signIn('google', { callbackUrl: '/' })} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-200">
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}