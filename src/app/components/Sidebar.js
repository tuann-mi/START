import { useState } from 'react';

export default function Sidebar({ onSelectTable }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-gray-800 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-width duration-300 relative min-w-10`}>
      <button onClick={toggleSidebar} className="p-2 absolute top-2 right-2">
        {isCollapsed ? '▶' : '◀'}
      </button>
      <div className={`${isCollapsed ? 'hidden' : 'block'}`}>
        <ul className="mt-10">
          <li>
            <button onClick={() => onSelectTable('workOrders')} className="p-2 w-full text-left hover:bg-gray-700">
              Work Orders
            </button>
          </li>
          <li>
            <button onClick={() => onSelectTable('targetActual')} className="p-2 w-full text-left hover:bg-gray-700">
              Target vs Actual
            </button>
          </li>
          <li>
            <button onClick={() => onSelectTable('samplingStatus')} className="p-2 w-full text-left hover:bg-gray-700">
              Sampling Round Status
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}