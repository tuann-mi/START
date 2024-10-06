"use client";

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import Sidebar from '../../components/Sidebar';

export default function SitesPage() {
  return (
    <div id="sites-page-container" className="flex w-screen h-full max-w-full bg-white dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div id="sites-content-container" className="flex-grow p-6 w-96">
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/sites">Sites</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">Sites</h1>
        <div id="overview-charts-container" className="flex flex-row rounded-md space-x-4 overflow-x-auto">
            <div className="mb-8 rounded-md p-4 bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md">

            </div>
        </div>
      </div>
    </div>
  );
};


