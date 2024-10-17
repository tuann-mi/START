"use client";

import { React, useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Sidebar from "../../components/Sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function SitesPage() {
  let [isLoading, setIsLoading] = useState(false);
  const [siteOverview, setSiteOverview] = useState([]);
  const [addressInfo, setAddressInfo] = useState([]);
  const searchParams = useSearchParams();
  const siteName = searchParams.get("siteName");
  const [openSite, setOpenSite] = useState(null);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [siteOverviewResponse, addressInfoResponse] = await Promise.all([
        fetch("/api/site-overview"),
        fetch("/api/address-info"),
      ]);
      if (!siteOverviewResponse.ok) {
        throw new Error("Site overview query failed.");
      }
      if (!addressInfoResponse.ok) {
        throw new Error("Address info query failed.");
      }
      const siteOverviewResult = await siteOverviewResponse.json();
      const addressInfoResult = await addressInfoResponse.json();
      setSiteOverview(siteOverviewResult);
      setAddressInfo(addressInfoResult);
      console.log("siteOverviewResult", siteOverviewResult.slice(0, 5));
      console.log("addressInfoResult", addressInfoResult.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (siteName) {
      setOpenSite(siteName);
    } else {
      setOpenSite(null); // Reset openSite if siteName is not present
    }
  }, [siteName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      id="sites-page-container"
      className="flex w-screen h-full max-w-full bg-white dark:bg-gray-900 transition-colors duration-300"
    >
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
        <h1 className="text-3xl mb-4 text-gray-900 dark:text-white font-bold">
          Sites
        </h1>
        <div className="flex flex-col justify-start rounded-md">
          <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">
            {/* TODO: Add filter options, sorting options, pagination, and other sample data */}
            <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">
              Overview
            </h1>
            <div className="bg-white rounded-md shadow-md p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Site Name</TableHead>
                    <TableHead className="text-black">Sampling Type</TableHead>
                    <TableHead className="text-black">Toxicologist</TableHead>
                    <TableHead className="text-black">
                      Project Manager
                    </TableHead>
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
                            <TableCell id="site-name-cell">
                              <Sheet
                                open={openSite === site.site_name}
                                onOpenChange={(isOpen) => {
                                  if (isOpen) {
                                    setOpenSite(site.site_name);
                                  } else {
                                    setOpenSite(null);
                                  }
                                }}
                              >
                                <SheetTrigger
                                  className="text-som-primary underline"
                                  onClick={() => setOpenSite(site.site_name)}
                                >
                                  {site.site_name}
                                </SheetTrigger>
                                <SheetContent className="overflow-y-auto w-full">
                                  <SheetHeader>
                                    <SheetTitle className="text-xl text-gray-900 dark:text-white font-bold">
                                      {site.site_name}
                                    </SheetTitle>
                                  </SheetHeader>
                                  <SheetDescription>
                                    <p>Toxicologist: {site.toxicologist}</p>
                                    <p>
                                      Project Manager: {site.project_manager}
                                    </p>
                                    <p>Sampling Type: {site.sampling_type}</p>
                                  </SheetDescription>
                                  <Separator className="my-4" />
                                  <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full "
                                  >
                                    <AccordionItem value="work-orders">
                                      <AccordionTrigger className="text-xl text-gray-900 dark:text-white font-bold">
                                        Active Work Orders
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <Table id="active-work-orders-table">
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-black">
                                                Address
                                              </TableHead>
                                              <TableHead className="text-black">
                                                Work Order Number
                                              </TableHead>
                                              <TableHead className="text-black">
                                                Work Order Status
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell>121 ETLE RD</TableCell>
                                              <TableCell>123456</TableCell>
                                              <TableCell>In Progress</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="mailing-receipts">
                                      <AccordionTrigger className="text-xl text-gray-900 dark:text-white font-bold">
                                        Mailing Receipts
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <Table id="mailing-receipts-table">
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-black">
                                                Address
                                              </TableHead>
                                              <TableHead className="text-black">
                                                Mailing Receipt Number
                                              </TableHead>
                                              <TableHead className="text-black">
                                                Mailing Status
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell>121 ETLE RD</TableCell>
                                              <TableCell>123456</TableCell>
                                              <TableCell>In Progress</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="addresses">
                                      <AccordionTrigger className="text-xl text-gray-900 dark:text-white font-bold">
                                        Related Addresses
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        <Table id="related-addresses-table">
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-black">
                                                Address
                                              </TableHead>
                                              <TableHead className="text-black">
                                                Program
                                              </TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {addressInfo
                                              .filter(
                                                (address) =>
                                                  address.site_name ===
                                                  site.site_name,
                                              )
                                              .map((address, index) => (
                                                <TableRow key={index}>
                                                  <TableCell>
                                                    <Link
                                                      href={`/dashboard/addresses?address=${encodeURIComponent(
                                                        address.address,
                                                      )}`}
                                                      className="text-som-primary underline"
                                                    >
                                                      {address.address}
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell>
                                                    {address.sampling_type}
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                          </TableBody>
                                        </Table>
                                        <div className="flex justify-start mt-4">
                                          <Button
                                            className="mr-2 bg-som-primary text-white"
                                            variant="outline"
                                          >
                                            Add Address
                                          </Button>
                                          <Button
                                            variant="outline"
                                            className="bg-som-primary text-white"
                                          >
                                            Edit Address
                                          </Button>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
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
            <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">
              Other stuff
            </h1>
            <div className="bg-white rounded-md shadow-md p-4">
              <p>something</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
