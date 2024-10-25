"use client";

import { React, Suspense } from "react";
import Sidebar from "../components/Sidebar.js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
function DashboardContent({ children }) {
  return (
    <div
      id="dashboard-page-container"
      className="flex w-screen h-full max-w-full bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <Sidebar />
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
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
