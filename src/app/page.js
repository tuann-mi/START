import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">MiEHCOS</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-300">Manage your workorders, view appointments, and more.</p>
        <div className="space-x-4">
          <Link href="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
            Dashboard
          </Link>
          <Link href="/calendar" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
            Calendar
          </Link>
        </div>
      </main>
    </div>
  );
}