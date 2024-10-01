'use client';

import { useEffect, useState } from 'react';
import CustomCalendar from '../components/CustomCalendar';
import EventForm from '../components/EventForm';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      // router.push('/login');
      // signIn('google', { callbackUrl: router.asPath });
    }
  }, [session, status]);

  const handleEventSubmit = async (event) => {
    console.log("event: ", event);

    if (!window.confirm(`Preview of your event:\nTitle: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nParticipants: ${event.participants.join(', ')}.\nConfirm submission?`)) {
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit event');
      }
  
      const newEvent = await response.json();
      setEvents([...events, newEvent]);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Calendar</h1>
      <CustomCalendar date={date} setDate={setDate} />

      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg mt-8 mb-8 p-6">
        <p className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Appointments</p>
        {/* placeholder data */}
        <ul>
          <li>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Event 1</p>
              <p className="text-gray-600 dark:text-gray-300">Date: 2024-01-01</p>
              <p className="text-gray-600 dark:text-gray-300">Time: 10:00 AM</p>
              <p className="text-gray-600 dark:text-gray-300">Participants: John Doe, Jane Doe</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Schedule a work order</h2>
          <EventForm onSubmit={handleEventSubmit} />
          <ul className="mt-4 space-y-2">
            {events.map((event, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                <p className="font-semibold text-gray-900 dark:text-white">{event.date} at {event.time}</p>
                <p className="text-gray-600 dark:text-gray-300">Event: {event.title}</p>
                <p className="text-gray-600 dark:text-gray-300">Participants: {event.participants.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}