"use client";

import { useState } from 'react';
import CustomCalendar from '../components/CustomCalendar';
import Link from 'next/link';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Calendar</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Appointments</h2>
          <div className="border border-gray-200 dark:border-gray-700 p-4 text-center">
            <CustomCalendar date={date} setDate={setDate} />
          </div>
          {/* Placeholder for appointment list */}
          <ul className="mt-4 space-y-2">
            <AppointmentItem date="2023-04-15" time="10:00 AM" client="John Doe" />
            <AppointmentItem date="2023-04-16" time="2:00 PM" client="Jane Smith" />
            <AppointmentItem date="2023-04-17" time="11:30 AM" client="Bob Johnson" />
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

function AppointmentItem({ date, time, client }) {
  return (
    <li className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600">
      <p className="font-semibold text-gray-900 dark:text-white">{date} at {time}</p>
      <p className="text-gray-600 dark:text-gray-300">Client: {client}</p>
    </li>
  );
}