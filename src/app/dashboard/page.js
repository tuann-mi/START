"use client";

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DataTable from '../components/DataTable';
import PasswordPrompt from '../components/DevPasswordPrompt.js';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [workOrdersData, setWorkOrdersData] = useState([]);
  const [targetActualData, setTargetActualData] = useState([]);
  const [samplingStatusData, setSamplingStatusData] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  let [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isOverride, setIsOverride] = useState(false);

  // TODO: Make this a more generic function that can be used for other tables
  // TODO: Add a dropdown to select the table to fetch data for
  // TODO: Better error handling
  const fetchData = async () => {
    try {
        setIsLoading(true);
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

      console.log(workOrdersResult);
      console.log(targetActualResult);
      console.log(samplingStatusResult);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      console.log('User is not authenticated');
      // router.push('/login');
    } else {
      console.log('User is authenticated:', session.user.email);
    }
  }, [session, status]);

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

  const filteredData = (data) => data.filter((item) =>
    item.site_name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedData = (data) => filteredData(data).sort((a, b) => {
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const columns = {
    workOrders: [
      { Header: 'Site Name', accessor: 'site_name' },
      { Header: 'Address', accessor: 'address' },
      { Header: 'Work Order Type', accessor: 'workorder_type' },
      { Header: 'Work Order Status', accessor: 'workorder_status' },
      { Header: 'Scheduled Date', accessor: 'workorder_scheduled_date' },
      { Header: 'Completed Date', accessor: 'workorder_completed_date' },
      { Header: 'Created By', accessor: 'workorder_record_created_by' },
      { Header: 'Sampling Eligibility', accessor: 'sampling_eligibility' },
      { Header: 'Sampling Round', accessor: 'sampling_round' },
    ],
    targetActual: [
      { Header: 'Site Name', accessor: 'site_name' },
      { Header: 'Target', accessor: 'target' },
      { Header: 'Actual', accessor: 'actual' },
      { Header: 'Difference', accessor: 'difference' },
    ],
    samplingStatus: [
      { Header: 'Site Name', accessor: 'site_name' },
      { Header: 'Sampling Round Status', accessor: 'sampling_round_status' },
    ],
  };

  // const handlePasswordSubmit = (password) => {
  //   const overridePassword = process.env.NEXT_PUBLIC_DEV_OVERRIDE_PASSWORD;
  //   if (password === overridePassword) {
  //     setIsOverride(true);
  //   } else {
  //     alert('Incorrect password');
  //   }
  // };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // if (!session && !isOverride) {
  //   return <PasswordPrompt onSubmit={handlePasswordSubmit} />;
  // }

  return (
    <div id="dashboard-page-container" className="flex w-screen h-full max-w-full bg-white dark:bg-gray-900 transition-colors duration-300">
          <Sidebar onSelectTables={setSelectedTables} />
          <div id="dashboard-content-container" className="flex-grow p-6 w-96">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div id="dashboard-header-container" className="mb-4">
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">Dashboard</h1>
            </div>
            <div id="general-info-container" className="rounded-md p-4 bg-gray-100 dark:bg-gray-800">
                <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-medium">Overview</h1>
                <div id="general-info-cards-container" className="flex flex-row items-center rounded-md space-x-4 overflow-x-auto pb-4 justify-evenly">
                    <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
                      <p className="text-xl font-medium text-gray-500 mb-2">Active Sites</p>
                      <span className="text-2xl font-bold text-gray-900">456</span>
                    </div>
                    <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
                      <p className="text-xl font-medium text-gray-500 mb-2">Mailings Sent</p>
                      <span className="text-2xl font-bold text-gray-900">23,479</span>
                    </div>
                    <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
                      <p className="text-xl font-medium text-gray-500 mb-2">Homes Sampled</p>
                      <span className="text-2xl font-bold text-gray-900">2,394,857</span>
                    </div>
                    <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
                      <p className="text-xl font-medium text-gray-500 mb-2">Samples Processed</p>
                      <span className="text-2xl font-bold text-gray-900">982,938,475</span>
                    </div>
                </div>
                <div id="general-info-charts-container" className="flex flex-row items-center rounded-md space-x-4 overflow-x-auto pb-4 justify-evenly">
                  
                  <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
                  </div>
                </div>
            </div>
            <div id="fetch-data-button-container" className="flex flex-row items-center space-x-4">
              {selectedTables.length > 0 && (
                <div className="flex flex-row items-center mt-6">
                  <button
                    onClick={fetchData}
                    className="bg-som-primary text-white px-4 py-2 rounded-md hover:som-secondary dark:hover:som-secondary-dark transition duration-300 ease-in-out mr-4"
                  >
                    Fetch Data
                  </button>
                  {isLoading && (
                    <>
                      <div role="status">
                          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                          </svg>
                          <span className="sr-only">Loading...</span>
                      </div>
                    </>
                  )}
                </div>

              )}
            </div>
            <div id="dashboard-tables-container" className="flex">
              <div id="dashboard-tables" className="flex-grow py-4 mt-4 overflow-x-auto">
                {selectedTables.includes('workOrders') && (
                  <div className="overflow-x-scroll mb-8 rounded-md p-4 bg-gray-100 dark:bg-gray-800">
                    <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-medium">Work Orders</h1>
                    <DataTable data={sortedData(workOrdersData)} columns={columns.workOrders} />
                  </div>
                )}
                {selectedTables.includes('targetActual') && (
                  <div className="overflow-x-scroll mb-8 rounded-md p-4 bg-gray-100 dark:bg-gray-800">
                    <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-medium">Target vs Actual</h1>
                    <DataTable data={sortedData(targetActualData)} columns={columns.targetActual} />
                  </div>
                )}
                {selectedTables.includes('samplingStatus') && (
                  <div className="overflow-x-scroll mb-8 rounded-md p-4 bg-gray-100 dark:bg-gray-800">
                    <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-medium">Sampling Round Status</h1>
                    <DataTable data={sortedData(samplingStatusData)} columns={columns.samplingStatus} />
                  </div>
                )}
                {selectedTables.includes('callTracking') && (
                  <div className="overflow-x-scroll mb-8 rounded-md p-4 bg-gray-100 dark:bg-gray-800">
                    <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-medium">Call Tracking</h1>
                    <DataTable data={sortedData(samplingStatusData)} columns={columns.samplingStatus} />
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
}