"use client";

import { React, useState, useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import Sidebar from '../../components/Sidebar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function SitesPage() {
  let [isLoading, setIsLoading] = useState(false);
  const [siteOverview, setSiteOverview] = useState([]);
  const [addressInfo, setAddressInfo] = useState([]);

  const fetchData = async () => {
    try {
        setIsLoading(true);
        const [siteOverviewResponse, addressInfoResponse] = await Promise.all([
        fetch('/api/site-overview'),
        fetch('/api/address-info'),
      ]);
      if (!siteOverviewResponse.ok) {
        throw new Error('Site overview query failed.');
      }
      if (!addressInfoResponse.ok) {
        throw new Error('Address info query failed.');
      }
      const siteOverviewResult = await siteOverviewResponse.json();
      const addressInfoResult = await addressInfoResponse.json();
      setSiteOverview(siteOverviewResult);
      setAddressInfo(addressInfoResult);
      console.log("siteOverviewResult", siteOverviewResult.slice(0, 5));
      console.log("addressInfoResult", addressInfoResult.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div>
          Loading...
      </div>
  );
  }

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
        <div className="flex flex-col justify-start rounded-md">
          <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">
            {/* TODO: Add filter options, sorting options, pagination, and other sample data */}
            <div className="bg-white rounded-md shadow-md p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Site Name</TableHead>
                    <TableHead className="text-black">Sampling Type</TableHead>
                    <TableHead className="text-black">Toxicologist</TableHead>
                    <TableHead className="text-black">Project Manager</TableHead>
                    <TableHead className="text-black">DEH Contact</TableHead>
                    <TableHead className="text-black">EGLE Contact</TableHead>
                    <TableHead className="text-black">LHD Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteOverview.map((site, index) => (
                    <TableRow key={index}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <TableCell id="site-name-cell" className="font-bold">
                              <Sheet>
                                <SheetTrigger className="text-som-primary hover:underline">{site.site_name}</SheetTrigger>
                                <SheetContent className="overflow-y-auto w-full">
                                  <SheetHeader>
                                    <SheetTitle>{site.site_name}</SheetTitle>
                                  </SheetHeader>
                                  <SheetDescription>
                                    <p>Toxicologist: {site.toxicologist}</p>
                                    <p>Project Manager: {site.project_manager}</p>
                                    <p>Sampling Type: {site.sampling_type}</p>
                                  </SheetDescription>
                                  <Separator className="my-4"/>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-black">Addresses</TableHead>
                                        <TableHead className="text-black">Program</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {addressInfo
                                      .filter(address => address.site_name === site.site_name)
                                      .map((address, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{address.address}</TableCell>
                                          <TableCell>{address.sampling_type}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </SheetContent>
                              </Sheet>
                            </TableCell>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view more information</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TableCell>{site.sampling_type}</TableCell>
                      <TableCell>{site.toxicologist}</TableCell>
                      <TableCell>{site.project_manager}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4">
          <p>other stuff</p>
          </div>
        </div>
      </div>
    </div>
  );
};


