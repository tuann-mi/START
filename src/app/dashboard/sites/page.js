"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/headers";
import { SectionContainer, SubSectionContainer } from "@/components/ui/content-containers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { React, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSearchParams } from "next/navigation";
import { useSiteOverview } from "@/lib/queries";

const placeholders = {
  deh_contact: "TBD",
  egle_contact: "TBD",
  lhd_contact: "TBD",
};

export default function Sites() {
  const { data: siteOverview } = useSiteOverview();
  const [addressInfo, setAddressInfo] = useState([]);
  const searchParams = useSearchParams();
  const siteName = searchParams.get("siteName");
  const [openSite, setOpenSite] = useState(null);

  useEffect(() => {
    if (siteName) {
      setOpenSite(siteName);
    } else {
      setOpenSite(null); // Reset openSite if siteName is not present
    }
    return () => {
      setOpenSite(null);
    };
  }, [siteName]);

  return (
    <>
      <SectionContainer>
        <SectionHeader title="Overview" />
        <SubSectionContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Site Name</TableHead>
                <TableHead className="text-black">Toxicologist</TableHead>
                <TableHead className="text-black">EQA</TableHead>
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
                        <TooltipTrigger asChild>
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
                                <>
                                  Toxicologist: {site.toxicologist}
                                  <br />
                                  EQA: {site.eqa}
                                </>
                              </SheetDescription>
                              <Separator className="my-4" />
                              <Accordion type="single" collapsible className="w-full ">
                                <AccordionItem value="work-orders">
                                  <AccordionTrigger className="text-xl text-gray-900 dark:text-white font-bold">
                                    Active Work Orders
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <Table id="active-work-orders-table">
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-black">Address</TableHead>
                                          <TableHead className="text-black">Work Order Number</TableHead>
                                          <TableHead className="text-black">Work Order Status</TableHead>
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
                                          <TableHead className="text-black">Address</TableHead>
                                          <TableHead className="text-black">Mailing Receipt Number</TableHead>
                                          <TableHead className="text-black">Mailing Status</TableHead>
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
                                          <TableHead className="text-black">Address</TableHead>
                                          <TableHead className="text-black">Program</TableHead>
                                          <TableHead className="text-black">Property Type</TableHead>
                                          <TableHead className="text-black">Local Health Dept</TableHead>
                                          <TableHead className="text-black">Owner 1</TableHead>
                                          <TableHead className="text-black">Owner 2</TableHead>
                                          <TableHead className="text-black">Owner Phone 1</TableHead>
                                          <TableHead className="text-black">Owner Phone 2</TableHead>
                                          <TableHead className="text-black">Owner Email</TableHead>
                                          <TableHead className="text-black">Owner Mailing Address</TableHead>
                                          <TableHead className="text-black">Owner Mailing City State Zip</TableHead>
                                          <TableHead className="text-black">Tenant 1</TableHead>
                                          <TableHead className="text-black">Tenant 2</TableHead>
                                          <TableHead className="text-black">Tenant Phone 1</TableHead>
                                          <TableHead className="text-black">Tenant Phone 2</TableHead>
                                          <TableHead className="text-black">Tenant Email</TableHead>
                                          <TableHead className="text-black">Tenant Mailing Address</TableHead>
                                          <TableHead className="text-black">Tenant Mailing City State Zip</TableHead>
                                          <TableHead className="text-black">Tenant Preferred Language</TableHead>
                                          <TableHead className="text-black">Tenant Date Last Verified</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {addressInfo
                                          .filter((address) => address.site_name === site.site_name)
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
                                              <TableCell>{address.sampling_type}</TableCell>
                                              <TableCell>Owner Occupied</TableCell>
                                            </TableRow>
                                          ))}
                                      </TableBody>
                                    </Table>
                                    <div className="flex justify-start mt-4 space-x-2">
                                      <Button
                                        className="bg-som-primary text-white hover:bg-som-primary hover:text-white"
                                        variant="outline"
                                      >
                                        Add Address
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="bg-som-primary text-white hover:bg-som-primary hover:text-white"
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
                  <TableCell>{site.toxicologist}</TableCell>
                  <TableCell>{site.eqa}</TableCell>
                  <TableCell>{placeholders.deh_contact}</TableCell>
                  <TableCell>{placeholders.egle_contact}</TableCell>
                  <TableCell>{placeholders.lhd_contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SubSectionContainer>
      </SectionContainer>
    </>
  );
}
