import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useTheme } from './ThemeProvider';
import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '../../utils/auth';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();
  // const { session, status } = useAuth(router);
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Upload', href: '/upload' },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm w-full">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div id="navbar-left" className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
                MiEHCOS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-green-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-md font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div id="navbar-right" className="flex items-center relative">
            {session ? (
              <>
                <button 
                  onClick={toggleDropdown} 
                  className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200"
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
                      onClick={() => {toggleTheme(); console.log("Theme: ", theme);}}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                    >
                      {theme === 'dark' ? 'Set to light-mode' : 'Set to dark-mode'}
                    </button>
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
              <button onClick={() => signIn('google', { callbackUrl: '/' })} className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition duration-200">
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
          </div>
        </div>
      </div>
    </nav>
  );
}