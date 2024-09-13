import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Upcoming Appointments" count={5} />
        <DashboardCard title="Total Customers" count={120} />
        <DashboardCard title="Recent Activities" count={10} />
      </div>
      <div className="mt-8">
        <Link href="/calendar" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
          View Calendar
        </Link>
      </div>
    </div>
  );
}

function DashboardCard({ title, count }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg transition-shadow duration-300 hover:shadow-xl">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{count}</p>
      </div>
    </div>
  );
}