"use client";

import { useSession, signIn } from "next-auth/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionHeader } from "@/components/ui/headers";
import { SectionContainer } from "@/components/ui/content-containers";
export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <>
      <SectionContainer>
        <SectionHeader title="Overview" />
        <div
          id="overview-cards-container"
          className="flex flex-row items-center rounded-md space-x-4 overflow-x-auto pb-4 justify-evenly"
        >
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
        <div id="overview-charts-container" className="flex flex-row rounded-md space-x-4 overflow-x-auto">
          <div className="mb-8 rounded-md p-4 bg-white shadow-md">
            <h1 className="text-xl mb-4 text-gray-900 font-bold">Recent mailings completed</h1>
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
      </SectionContainer>
    </>
  );
}
