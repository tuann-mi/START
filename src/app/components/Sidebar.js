import { useState, useEffect } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Sidebar({ onSelectTables }) {
  const [isNotCollapsed, setIsNotCollapsed] = useState(true);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsNotCollapsed(window.innerWidth > 768);
    }
  }, []);
  const toggleSidebar = () => {
    setIsNotCollapsed(!isNotCollapsed);
  };
  const sidebarOptions = ['Dashboard', 'Sites', 'Addresses']
  return (
    <div id="sidebar" className={`bg-gray-100 dark:bg-gray-800 dark:text-white h-full ${isNotCollapsed ? 'w-48' : 'w-12'} transition-width duration-500 z-40 flex flex-col`}>
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="relative right-2">
          <FontAwesomeIcon icon={isNotCollapsed ? faChevronLeft : faChevronRight} />
        </button>
      </div>
      <div className={`${isNotCollapsed ? 'block' : 'hidden'} p-2`}>
        <form>
          <input type="text" placeholder="Search" className="w-full p-2 rounded-md" /> 
        </form>
      </div>
      <div className={`${isNotCollapsed ? 'block' : 'hidden'}`}>
        <ul className="mx-2">
          {sidebarOptions.map((option) => (
            <li key={option}>
              {option === 'Dashboard' ? (
                <a href={`/dashboard`} className="flex items-center text-gray-900 dark:text-white p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md font-medium">{option}</a>
              ) : (
                <a href={`/dashboard/${option.toLowerCase()}`} className="flex items-center text-gray-900 dark:text-white p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md font-medium">{option}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}