"use client";

import { useEffect, useState, useRef } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { SectionHeader } from "@/components/ui/headers";
import { SectionContainer } from "@/components/ui/content-containers";
import { useDashboardStats } from "@/lib/queries";

export const runtime = "edge";

export default function Dashboard() {
  const [filters, setFilters] = useState({});
  const { data: stats, error } = useDashboardStats();

  if (error) return <div>Error loading dashboard stats</div>;
  if (!stats) return <div>Loading...</div>;

  const handleChartClick = (chart, element) => {
    if (!element.length) return;

    const dataIndex = element[0].index;
    const datasetLabel = chart.data.labels[dataIndex];

    setFilters((prev) => ({
      ...prev,
      [chart.id]: datasetLabel,
    }));
  };

  const getFilteredData = () => {
    if (!stats || Object.keys(filters).length === 0) return stats;

    let filteredStats = { ...stats };

    if (filters.program) {
      const programIndex = stats.sitesByProgram.labels.indexOf(filters.program);
      filteredStats = {
        ...filteredStats,
        overview: {
          ...stats.overview,
          totalSites: stats.sitesByProgram.data[programIndex],
        },
        analyteDistribution: {
          labels: stats.analyteDistribution.labels.filter(
            (_, i) =>
              stats.analyteDistribution.data[i] > 0 && stats.sitesByProgram.labels[programIndex] === filters.program,
          ),
          data: stats.analyteDistribution.data.filter(
            (val, i) => val > 0 && stats.sitesByProgram.labels[programIndex] === filters.program,
          ),
        },
      };
    }

    if (filters.month) {
      const monthIndex = stats.samplesByMonth.labels.indexOf(filters.month);
      filteredStats = {
        ...filteredStats,
        overview: {
          ...filteredStats.overview,
          totalSamples: stats.samplesByMonth.data[monthIndex],
        },
      };
    }

    if (filters.analyte) {
      const analyteIndex = stats.analyteDistribution.labels.indexOf(filters.analyte);
      filteredStats = {
        ...filteredStats,
        overview: {
          ...filteredStats.overview,
          totalSamples: stats.analyteDistribution.data[analyteIndex],
        },
      };
    }

    return filteredStats;
  };

  const filteredStats = getFilteredData();

  return (
    <>
      <SectionContainer>
        <SectionHeader title="Overview" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Sites</h3>
            <p className="text-2xl font-bold">{stats.overview.totalSites}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Addresses</h3>
            <p className="text-2xl font-bold">{stats.overview.totalAddresses}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Total Samples</h3>
            <p className="text-2xl font-bold">{stats.overview.totalSamples}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">Active Programs</h3>
            <p className="text-2xl font-bold">{stats.overview.activePrograms}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sites by Program */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Sites by Program</h3>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: stats.sitesByProgram.labels,
                  datasets: [
                    {
                      data: stats.sitesByProgram.data,
                      backgroundColor: ["#1e7a87", "#0876a7", "#287c78"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) =>
                    handleChartClick({ id: "program", data: stats.sitesByProgram }, elements),
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>

          {/* Samples by Month */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Samples by Month</h3>
            <div className="h-[300px]">
              <Line
                data={{
                  labels: stats.samplesByMonth.labels,
                  datasets: [
                    {
                      data: stats.samplesByMonth.data,
                      borderColor: "#1e7a87",
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) => handleChartClick({ id: "month", data: stats.samplesByMonth }, elements),
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>

          {/* Analyte Distribution */}
          <div className="bg-white p-4 rounded-lg shadow-md lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Analyte Distribution</h3>
            <div className="h-[300px]">
              <Doughnut
                data={{
                  labels: stats.analyteDistribution.labels,
                  datasets: [
                    {
                      data: stats.analyteDistribution.data,
                      backgroundColor: ["#1e7a87", "#0876a7", "#287c78", "#2a9d8f", "#264653"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) =>
                    handleChartClick({ id: "analyte", data: stats.analyteDistribution }, elements),
                }}
              />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <span
                  key={key}
                  className="px-3 py-1 bg-som-primary text-white rounded-full text-sm flex items-center gap-2"
                >
                  {key}: {value}
                  <button
                    onClick={() =>
                      setFilters((prev) => {
                        const newFilters = { ...prev };
                        delete newFilters[key];
                        return newFilters;
                      })
                    }
                    className="hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </SectionContainer>
    </>
  );
}
