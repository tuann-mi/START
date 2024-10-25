"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "../components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
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
      const [workOrdersResponse, targetActualResponse, samplingStatusResponse] =
        await Promise.all([
          fetch("/api/work-orders"),
          fetch("/api/target-actual-difference"),
          fetch("/api/sampling-round-status"),
        ]);

      if (
        !workOrdersResponse.ok ||
        !targetActualResponse.ok ||
        !samplingStatusResponse.ok
      ) {
        throw new Error("Failed to fetch data");
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
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("User is not authenticated");
      // router.push('/login');
    } else {
      console.log("User is authenticated:", session.user.email);
    }
  }, [session, status]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (key) => {
    if (sortKey === key) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const filteredData = (data) =>
    data.filter((item) =>
      item.site_name.toLowerCase().includes(filter.toLowerCase())
    );

  const sortedData = (data) =>
    filteredData(data).sort((a, b) => {
      if (sortKey) {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const columns = {
    workOrders: [
      { Header: "Site Name", accessor: "site_name" },
      { Header: "Address", accessor: "address" },
      { Header: "Work Order Type", accessor: "workorder_type" },
      { Header: "Work Order Status", accessor: "workorder_status" },
      { Header: "Scheduled Date", accessor: "workorder_scheduled_date" },
      { Header: "Completed Date", accessor: "workorder_completed_date" },
      { Header: "Created By", accessor: "workorder_record_created_by" },
      { Header: "Sampling Eligibility", accessor: "sampling_eligibility" },
      { Header: "Sampling Round", accessor: "sampling_round" },
    ],
    targetActual: [
      { Header: "Site Name", accessor: "site_name" },
      { Header: "Target", accessor: "target" },
      { Header: "Actual", accessor: "actual" },
      { Header: "Difference", accessor: "difference" },
    ],
    samplingStatus: [
      { Header: "Site Name", accessor: "site_name" },
      { Header: "Sampling Round Status", accessor: "sampling_round_status" },
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

  // if (!session && !isOverride) {
  //   return <PasswordPrompt onSubmit={handlePasswordSubmit} />;
  // }

  if (isLoading) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  return (
    <>
      <div id="dashboard-header-container" className="mb-4">
        <PageHeader title="Dashboard" />
      </div>
      <div
        id="overview-container"
        className="rounded-md p-4 bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md"
      >
        <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">
          Overview
        </h1>
        <div
          id="overview-cards-container"
          className="flex flex-row items-center rounded-md space-x-4 overflow-x-auto pb-4 justify-evenly"
        >
          <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
            <p className="text-xl font-medium text-gray-500 mb-2">
              Active Sites
            </p>
            <span className="text-2xl font-bold text-gray-900">456</span>
          </div>
          <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
            <p className="text-xl font-medium text-gray-500 mb-2">
              Mailings Sent
            </p>
            <span className="text-2xl font-bold text-gray-900">23,479</span>
          </div>
          <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
            <p className="text-xl font-medium text-gray-500 mb-2">
              Homes Sampled
            </p>
            <span className="text-2xl font-bold text-gray-900">2,394,857</span>
          </div>
          <div className="flex flex-col rounded-md p-4 bg-white shadow-md min-h-full grow">
            <p className="text-xl font-medium text-gray-500 mb-2">
              Samples Processed
            </p>
            <span className="text-2xl font-bold text-gray-900">
              982,938,475
            </span>
          </div>
        </div>
        <div
          id="overview-charts-container"
          className="flex flex-row rounded-md space-x-4 overflow-x-auto"
        >
          <div className="mb-8 rounded-md p-4 bg-white shadow-md">
            <h1 className="text-xl mb-4 text-gray-900 font-bold">
              Recent mailings completed
            </h1>
            <Table>
              <TableHeader>
                <TableRow className="hover:dark:bg-gray-100">
                  <TableHead>Site Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Treatment Type</TableHead>
                  <TableHead>Sent By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-gray-900 dark:hover:bg-gray-100">
                  <TableCell>Site 1</TableCell>
                  <TableCell>1234 Main St</TableCell>
                  <TableCell>2024-01-01</TableCell>
                  <TableCell>Water Softener</TableCell>
                  <TableCell>John Doe</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
