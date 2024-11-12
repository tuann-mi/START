"use client";

import { SectionHeader, ChartHeader } from "@/components/ui/headers";
import { SectionContainer, ChartContainer, ChartGrid } from "@/components/ui/content-containers";
import FilterDropdown from "@/components/ui/filter-dropdown-menu";
import { useDashboardStats } from "@/lib/queries";
import Card from "./components/card";
import { Bar, Line } from "react-chartjs-2";
import { graphColors } from "@/lib/constants";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, registerables } from "chart.js";
import { randomIndex, createColorMap } from "@/lib/utils";
import { colorPalette } from "@/lib/constants";
Chart.register(...registerables);

export const runtime = "edge";

export default function Dashboard() {
  const { data } = useDashboardStats();

  const filterSections = [
    {
      id: "year",
      title: "Year",
      options: data.samplesByMonth?.years.sort((a: number, b: number) => b - a) ?? [],
    },
    {
      id: "month",
      title: "Month",
      options: data.samplesByMonth?.labels ?? [],
    },
    {
      id: "program",
      title: "Program",
      options: data.addressesByProgram?.labels ?? [],
    },
  ];
  const colorMap = createColorMap(data.addressesByProgram.labels, colorPalette.vibrant);
  return (
    <div>
      <SectionContainer>
        <div id="header-container" className="flex justify-between items-center mb-4">
          <SectionHeader title="Overview" className="mb-0" />
          <FilterDropdown sections={filterSections} />
        </div>
        <div id="cards-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card cardHeader="Total Sites" cardData={data.overview.totalSites} />
          <Card cardHeader="Total Addresses" cardData={data.overview.totalAddresses} />
          <Card cardHeader="Total Samples" cardData={data.overview.totalSamples} />
          <Card cardHeader="Active Programs" cardData={data.overview.activePrograms} />
        </div>
        <ChartGrid>
          <ChartContainer>
            <ChartHeader title="Count of Addresses by Program" />
            <Bar
              data={{
                labels: data.addressesByProgram.labels,
                datasets: [
                  {
                    data: data.addressesByProgram.data,
                    backgroundColor: colorPalette.vibrant,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
              className="max-h-[300px] 2xl:max-h-[600px]"
            />
          </ChartContainer>
          <ChartContainer className="p-4">
            <ChartHeader title="Samples by Month" />
            <Line
              data={{
                labels: data.samplesByMonth.labels,
                datasets: [
                  {
                    data: data.samplesByMonth.data,
                    borderColor: colorPalette.vibrant[1],
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
              className="max-h-[300px] 2xl:max-h-[600px]"
            />
          </ChartContainer>
        </ChartGrid>
      </SectionContainer>
    </div>
  );
}
