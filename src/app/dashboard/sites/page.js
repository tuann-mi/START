"use client";

import { React, useState, useEffect } from "react";
import {
  Table,
  TableBody,
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
import PageHeader from "../../components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
export default function Sites() {
  const [isLoading, setIsLoading] = useState(true);
  const [siteOverview, setSiteOverview] = useState([]);
  const [addressInfo, setAddressInfo] = useState([]);
  const searchParams = useSearchParams();
  const siteName = searchParams.get("siteName");
  const [openSite, setOpenSite] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      // Check if sessionStorage is available
      const storedSiteOverviewData = sessionStorage.getItem("siteOverviewData");
      const storedAddressInfoData = sessionStorage.getItem("addressInfoData");
      if (storedSiteOverviewData && storedAddressInfoData) {
        console.log(
          "storedSiteOverviewData",
          JSON.parse(storedSiteOverviewData)
        );
        console.log("storedAddressInfoData", JSON.parse(storedAddressInfoData));
        setSiteOverview(JSON.parse(storedSiteOverviewData));
        setAddressInfo(JSON.parse(storedAddressInfoData));
        setIsLoading(false);
        console.log("Data loaded from sessionStorage");
      } else {
        const fetchData = async () => {
          try {
            const [siteOverviewResponse, addressInfoResponse] =
              await Promise.all([
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
            sessionStorage.setItem(
              "siteOverviewData",
              JSON.stringify(siteOverviewResult)
            );
            sessionStorage.setItem(
              "addressInfoData",
              JSON.stringify(addressInfoResult)
            );
            console.log("siteOverviewResult", siteOverviewResult.slice(0, 5));
            console.log("addressInfoResult", addressInfoResult.slice(0, 5));
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchData();
      }
    }
  }, []);

  useEffect(() => {
    if (siteName) {
      setOpenSite(siteName);
    } else {
      setOpenSite(null); // Reset openSite if siteName is not present
    }
  }, [siteName]);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Sites" />
        <div className="flex flex-col justify-start rounded-md">
          <Skeleton className="w-full h-[500px] bg-gray-100 dark:bg-gray-800" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Sites" />
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
                  <TableHead className="text-black">Project Manager</TableHead>
                  <TableHead className="text-black">DEH Contact</TableHead>
                  <TableHead className="text-black">EGLE Contact</TableHead>
                  <TableHead className="text-black">LHD Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {siteOverview.map((site, index) => (
                  <TableRow key={index}>
                    <TableCell id="site-name-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
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
                                  <p>Project Manager: {site.project_manager}</p>
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
                                            <TableHead className="text-black">
                                              Property Type
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Notes
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Number of Wells
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Sampling Eligibility
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Sampling Address Clean
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Sampling City State ZIP
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Property Notes
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Multiple Wells
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Shared Well Addresses
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Long Term Solution
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Well Depth
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Treatment
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Local Health Dept
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner First Name 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Last Name 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner First Name 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Last Name 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Phone 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Phone 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Email
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Mailing Address
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Mailing City State Zip
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Preferred Language
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Date Last Verified
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Verification Source
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Owner Notes
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant First Name 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Last Name 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant First Name 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Last Name 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Phone 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Phone 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Email
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Mailing Address
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Mailing City State Zip
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Preferred Language
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Date Last Verified
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Verification Source
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Tenant Notes
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing Full Name
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing First Name
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing Phone
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing Email
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing Address
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing City State Zip
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing Preferred Language
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Mailing-Sampling Address Match
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Date 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Time 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Contacted By 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Notes 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Call Outcome 1
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Date 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Time 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Contacted By 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Notes 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Call Outcome 2
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Date 3
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Time 3
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Contacted By 3
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Notes 3
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Call Outcome 3
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Scheduling Status
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Door Knock Needed?
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Date Door Knocked
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Door Knock Outcome
                                            </TableHead>
                                            <TableHead className="text-black">
                                              S123 Sample Date
                                            </TableHead>
                                            <TableHead className="text-black">
                                              S123 Sample Class
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Street Name
                                            </TableHead>
                                            <TableHead className="text-black">
                                              Date Address Standardized
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {addressInfo
                                            .filter(
                                              (address) =>
                                                address.site_name ===
                                                site.site_name
                                            )
                                            .map((address, index) => (
                                              <TableRow key={index}>
                                                <TableCell>
                                                  <Link
                                                    href={`/dashboard/addresses?address=${encodeURIComponent(
                                                      address.address
                                                    )}`}
                                                    className="text-som-primary underline"
                                                  >
                                                    {address.address}
                                                  </Link>
                                                </TableCell>
                                                <TableCell>
                                                  {address.sampling_type}
                                                </TableCell>
                                                <TableCell>
                                                  Owner Occupied
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                        </TableBody>
                                      </Table>
                                      <div className="flex justify-start mt-4 space-x-2">
                                        <Button
                                          className="bg-som-primary text-white hover:bg-som-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                                          variant="outline"
                                        >
                                          Add Address
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="bg-som-primary text-white hover:bg-som-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                          Edit Address
                                        </Button>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </SheetContent>
                            </Sheet>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view more information</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
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
    </>
  );
}
