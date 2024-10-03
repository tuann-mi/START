import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function Sidebar({ onSelectTables }) {
  const [isNotCollapsed, setIsNotCollapsed] = useState(false);
  const [sites, setSites] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);

  const toggleSidebar = () => {
    setIsNotCollapsed(!isNotCollapsed);
  };

  const fetchSites = async () => {
    const response = await fetch('/api/sites');
    const data = await response.json();
    setSites(data);
    console.log(data);
  };

  const handleCheckboxChange = (table) => {
    setSelectedTables((prevSelectedTables) =>
      prevSelectedTables.includes(table)
        ? prevSelectedTables.filter((t) => t !== table)
        : [...prevSelectedTables, table]
    );
  };

  const handleSiteSelection = (site) => {
    setSelectedSites((prevSelectedSites) =>
      prevSelectedSites.includes(site)
        ? prevSelectedSites.filter((s) => s !== site)
        : [...prevSelectedSites, site]
    );
  };

  useEffect(() => {
    onSelectTables(selectedTables);
  }, [selectedTables, onSelectTables]);

  useEffect(() => {
    fetchSites();
  }, []);
  return (
    <div id="sidebar" className={`bg-gray-100 dark:bg-gray-800 dark:text-white h-full ${isNotCollapsed ? 'w-64' : 'w-12'} transition-width duration-500 z-40 flex flex-col`}>
      <div className="flex justify-end p-2">
        <button onClick={toggleSidebar} className="relative right-2">
          {isNotCollapsed ? '◀' : '▶'}
        </button>
      </div>
      <div className={`${isNotCollapsed ? 'block' : 'hidden'} p-2`}>
        <form>
          {/* TO DO: Add search functionality */}
          <input type="text" placeholder="Search" className="w-full p-2 rounded-md" /> 
        </form>
      </div>
      <div className={`${isNotCollapsed ? 'block' : 'hidden'} p-2`}>
        <div className="w-full bg-white dark:bg-gray-700 text-gray-400 dark:text-white rounded-md">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {sites.length > 0 && (
                sites.map((site) => (
                  <SelectItem key={site.id} value={site.site_name}>
                    <input
                      type="checkbox"
                      checked={selectedSites.includes(site.site_name)}
                      onChange={() => handleSiteSelection(site.site_name)}
                      className="mr-2"
                    />
                    {site.site_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {/* <MultiSelectDropdown options={sites} selectedOptions={selectedSites} onChange={handleSiteSelection} /> */}
        </div>
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