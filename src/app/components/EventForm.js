import { useState } from 'react';

export default function EventForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, time, participants: participants.split(',') });
    setTitle('');
    setDate('');
    setTime('');
    setParticipants('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 text-black dark:text-white mt-2">Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 text-black dark:text-white mt-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 text-black dark:text-white mt-2">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 text-black dark:text-white mt-2">Participants (comma separated emails)</label>
        <input
          type="text"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
      >
        Schedule Event
      </button>
    </form>
  );
}