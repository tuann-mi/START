import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect } from 'react';

export default function CustomCalendar({ date, setDate }) {
  useEffect(() => {
    // Apply Tailwind classes to react-calendar elements
    const calendar = document.querySelector('.react-calendar');
    if (calendar) {
      calendar.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-900', 'dark:text-gray-200', 'rounded-lg', 'shadow-lg');
      const buttons = calendar.querySelectorAll('.react-calendar__navigation button');
      buttons.forEach(button => {
        button.classList.add('text-gray-900', 'dark:text-gray-200', 'hover:bg-gray-200', 'dark:hover:bg-gray-700', 'rounded-md', 'p-2');
      });
      const tiles = calendar.querySelectorAll('.react-calendar__tile');
      tiles.forEach(tile => {
        tile.classList.add('text-gray-900', 'dark:text-gray-200', 'hover:bg-gray-200', 'dark:hover:bg-gray-700', 'rounded-md', 'p-2');
      });
      const activeTiles = calendar.querySelectorAll('.react-calendar__tile--active');
      activeTiles.forEach(tile => {
        tile.classList.add('bg-indigo-600', 'dark:bg-indigo-500', 'text-white');
      });
      const nowTiles = calendar.querySelectorAll('.react-calendar__tile--now');
      nowTiles.forEach(tile => {
        tile.classList.add('bg-blue-600', 'dark:bg-blue-500', 'text-white');
      });
    }
  }, []);

  return (
    <Calendar
      onChange={setDate}
      value={date}
      className="react-calendar"
    />
  );
}