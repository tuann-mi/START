"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <main className="container text-center mx-4">
      <div className="flex-grow flex flex-col items-center justify-center min-w-max">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white text-left mb-12 s">
          <span className="text-som-primary">Mi</span>chigan
          <br />
          <span className="text-som-primary">E</span>nvironmental
          <br />
          <span className="text-som-primary">H</span>ealth
          <br />
          <span className="text-som-primary">C</span>ommunication &
          <br />
          <span className="text-som-primary">O</span>utreach
          <br />
          <span className="text-som-primary">S</span>ystem
        </h1>
        <div className="space-x-8">
          <Link
            href="/dashboard"
            className="bg-som-primary text-white px-6 py-3 rounded-md hover:bg-som-secondary transition duration-300 ease-in-out"
          >
            Dashboard
          </Link>
          <Link
            href="/calendar"
            className="bg-som-primary text-white px-6 py-3 rounded-md hover:bg-som-secondary transition duration-300 ease-in-out"
          >
            Calendar
          </Link>
        </div>
      </div>
    </main>
  );
}
