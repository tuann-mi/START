"use client";

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
 
  return (
    <main className="container text-center mx-4">
      <div className="flex-grow flex flex-col items-center justify-center min-w-max">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white text-left mb-12 mt-12">
            <span className="text-green-600">Mi</span>chigan<br/>
            <span className="text-green-600">E</span>nvironmental<br/>
            <span className="text-green-600">H</span>ealth<br/>
            <span className="text-green-600">C</span>ommunication <p className="inline text-gray-900 dark:text-white">&</p><br/>
            <span className="text-green-600">O</span>utreach<br/>
            <span className="text-green-600">S</span>ystem
        </h1>
        {/* <p className="mb-8 text-gray-600 dark:text-gray-300 text-xl font-light">Manage your workorders, view appointments, and more.</p> */}
        {!session ? (
          <div className="flex flex-row items-center justify-center space-x-4 shadow-md p-4 rounded-md bg-gray-50 dark:bg-gray-800 w-full max-w-sm mb-12">
            <p className="text-gray-600 dark:text-gray-300">Please login to continue</p>
            {/* onClick={() => signIn('google', { callbackUrl: '/' })} */}
            <Link href="/login" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
              Login
            </Link>
          </div> // Come back to the login stuff later this is just a test
        ) : (
          <div className="space-x-4">
            <Link href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
              Dashboard
            </Link>
            <Link href="/calendar" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
              Calendar
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}