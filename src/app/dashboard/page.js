"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [workOrdersData, setWorkOrdersData] = useState([]);
  const [targetActualData, setTargetActualData] = useState([]);
  const [samplingStatusData, setSamplingStatusData] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [workOrdersResponse, targetActualResponse, samplingStatusResponse] = await Promise.all([
        fetch('/api/work-orders'),
        fetch('/api/target-actual-difference'),
        fetch('/api/sampling-round-status')
      ]);

      if (!workOrdersResponse.ok || !targetActualResponse.ok || !samplingStatusResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const workOrdersResult = await workOrdersResponse.json();
      const targetActualResult = await targetActualResponse.json();
      const samplingStatusResult = await samplingStatusResponse.json();

      setWorkOrdersData(workOrdersResult);
      setTargetActualData(targetActualResult);
      setSamplingStatusData(samplingStatusResult);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (key) => {
    if (sortKey === key) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const filteredWorkOrdersData = workOrdersData.filter((item) =>
    item.site_name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedWorkOrdersData = filteredWorkOrdersData.sort((a, b) => {
    if (sortKey) {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWorkOrdersData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <div className="overflow-x-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Work Orders</h2>
        <table className="min-w-full bg-white dark:bg-gray-800 table-fixed">
          <thead>
            <tr>
              <th className="px-2 py-2 w-1/6">
                <button onClick={() => handleSortChange('address')}>
                  Address {getSortIcon('address')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('workorder_type')}>
                  Work Order Type {getSortIcon('workorder_type')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('workorder_status')}>
                  Work Order Status {getSortIcon('workorder_status')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/6">
                <button onClick={() => handleSortChange('site_name')}>
                  Site Name {getSortIcon('site_name')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('id_workorder')}>
                  Work Order ID {getSortIcon('id_workorder')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('workorder_scheduled_date')}>
                  Scheduled Date {getSortIcon('workorder_scheduled_date')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('workorder_completed_date')}>
                  Completed Date {getSortIcon('workorder_completed_date')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('workorder_record_created_by')}>
                  Created By {getSortIcon('workorder_record_created_by')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('sampling_year')}>
                  Sampling Year {getSortIcon('sampling_year')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('lab_name')}>
                  Lab Name {getSortIcon('lab_name')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('sampling_eligibility')}>
                  Sampling Eligibility {getSortIcon('sampling_eligibility')}
                </button>
              </th>
              <th className="px-2 py-2 w-1/12">
                <button onClick={() => handleSortChange('sampling_round')}>
                  Sampling Round {getSortIcon('sampling_round')}
                </button>
              </th>
            </tr>
            <tr>
              <th className="px-2 py-2">
                <input
                  type="text"
                  placeholder="Filter"
                  value={filter}
                  onChange={handleFilterChange}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300"
                />
              </th>
              <th className="px-2 py-2" colSpan="11"></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id_workorder}>
                <td className="border px-2 py-2">{item.address}</td>
                <td className="border px-2 py-2">{item.workorder_type}</td>
                <td className="border px-2 py-2">{item.workorder_status}</td>
                <td className="border px-2 py-2">{item.site_name}</td>
                <td className="border px-2 py-2">{item.id_workorder}</td>
                <td className="border px-2 py-2">{item.workorder_scheduled_date}</td>
                <td className="border px-2 py-2">{item.workorder_completed_date}</td>
                <td className="border px-2 py-2">{item.workorder_record_created_by}</td>
                <td className="border px-2 py-2">{item.sampling_year}</td>
                <td className="border px-2 py-2">{item.lab_name}</td>
                <td className="border px-2 py-2">{item.sampling_eligibility}</td>
                <td className="border px-2 py-2">{item.sampling_round}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= sortedWorkOrdersData.length}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Target vs Actual</h2>
        <table className="min-w-full bg-white dark:bg-gray-800 table-fixed">
          <thead>
            <tr>
              <th className="px-2 py-2 w-1/3">Site Name</th>
              <th className="px-2 py-2 w-1/3">Target</th>
              <th className="px-2 py-2 w-1/3">Actual</th>
              <th className="px-2 py-2 w-1/3">Difference</th>
            </tr>
          </thead>
          <tbody>
            {targetActualData.map((item) => (
              <tr key={item.site_name}>
                <td className="border px-2 py-2">{item.site_name}</td>
                <td className="border px-2 py-2">{item.target}</td>
                <td className="border px-2 py-2">{item.actual}</td>
                <td className="border px-2 py-2">{item.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sampling Round Status</h2>
        <table className="min-w-full bg-white dark:bg-gray-800 table-fixed">
          <thead>
            <tr>
              <th className="px-2 py-2 w-1/2">Site Name</th>
              <th className="px-2 py-2 w-1/2">Sampling Round Status</th>
            </tr>
          </thead>
          <tbody>
            {samplingStatusData.map((item) => (
              <tr key={item.site_name}>
                <td className="border px-2 py-2">{item.site_name}</td>
                <td className="border px-2 py-2">{item.sampling_round_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}