"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../components/Sidebar.js";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function DynamicBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/");

      const title = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { title, href };
    });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function DashboardContent({ children }) {
  return (
    <div
      id="dashboard-page-container"
      className="flex w-screen h-full max-w-full bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <Sidebar />
      <div id="dashboard-content-container" className="flex-grow p-6 w-96">
        <DynamicBreadcrumb />
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <DashboardContent>{children}</DashboardContent>;
}
