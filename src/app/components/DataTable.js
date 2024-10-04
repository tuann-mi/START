'use client';

import { useState, useEffect } from 'react';

export default function DataTable({ data, columns }) {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      item[column.accessor].toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
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
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Filter"
          value={filter}
          onChange={handleFilterChange}
          className="block w-full text-sm text-gray-900 dark:text-gray-300 p-0.5"
        />
      </div>
      <table className="bg-white dark:bg-gray-800 table-auto w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-2 py-2">
                <button onClick={() => handleSortChange(column.accessor)}>
                  {column.Header} {getSortIcon(column.accessor)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.accessor} className="border px-2 py-2">
                  {item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 mb-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out hover:cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= sortedData.length}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out hover:cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}