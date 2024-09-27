import { useState, useEffect } from 'react';

export default function Sidebar({ onSelectTables }) {
  const [isNotCollapsed, setIsNotCollapsed] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);

  const toggleSidebar = () => {
    setIsNotCollapsed(!isNotCollapsed);
  };

  const handleCheckboxChange = (table) => {
    setSelectedTables((prevSelectedTables) =>
      prevSelectedTables.includes(table)
        ? prevSelectedTables.filter((t) => t !== table)
        : [...prevSelectedTables, table]
    );
  };

  useEffect(() => {
    onSelectTables(selectedTables);
  }, [selectedTables, onSelectTables]);

  return (
    <div id="sidebar" className={`dark:bg-gray-800 dark:text-white h-full ${isNotCollapsed ? 'w-64' : 'w-12'} transition-width duration-500 z-40 flex flex-col`}>
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="relative right-2">
          {isNotCollapsed ? '◀' : '▶'}
        </button>
      </div>
      <div className={`${isNotCollapsed ? 'block' : 'hidden'}`}>
        <ul className="mx-2">
          <li>
            <button
              onClick={() => handleCheckboxChange('general')}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes('general')}
                onChange={() => handleCheckboxChange('general')}
                className="mr-2"
              />
              General
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCheckboxChange('workOrders')}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes('workOrders')}
                onChange={() => handleCheckboxChange('workOrders')}
                className="mr-2"
              />
              Work Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCheckboxChange('targetActual')}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes('targetActual')}
                onChange={() => handleCheckboxChange('targetActual')}
                className="mr-2"
              />
              Target vs Actual
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCheckboxChange('samplingStatus')}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes('samplingStatus')}
                onChange={() => handleCheckboxChange('samplingStatus')}
                className="mr-2"
              />
              Sampling Round Status
            </button>
          </li>
          <li>
            <button
              onClick={() => handleCheckboxChange('callTracking')}
              className="flex items-center p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes('callTracking')}
                onChange={() => handleCheckboxChange('callTracking')}
                className="mr-2"
              />
              Call Tracking
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}