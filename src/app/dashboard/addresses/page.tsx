"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProgramsList } from "@/components/ui/program-badge";
import { useAddressOverview } from "@/lib/queries";
import { ErrorBoundary } from "react-error-boundary";
import { Owner, Tenant } from "@/lib/types";

export const runtime = "edge";

export default function Addresses() {
  const { data: addressOverviewData } = useAddressOverview();
  const searchParams = useSearchParams();
  const addressName = searchParams?.get("address");
  const [openAddress, setOpenAddress] = useState<string | null>(null);
  const ownerInfoTableColumns: Array<{ key: keyof Owner; label: string }> = [
    { key: "name", label: "Name" },
    { key: "phone_number", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "mailing_address", label: "Mailing Address" },
    { key: "mailing_city", label: "Mailing City" },
    { key: "mailing_state", label: "Mailing State" },
    { key: "mailing_zipcode", label: "Mailing Zipcode" },
  ];
  const tenantInfoTableColumns: Array<{ key: keyof Tenant; label: string }> = [
    { key: "name", label: "Name" },
    { key: "phone_number", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "mailing_address", label: "Mailing Address" },
    { key: "mailing_city", label: "Mailing City" },
    { key: "mailing_state", label: "Mailing State" },
    { key: "mailing_zipcode", label: "Mailing Zipcode" },
  ];
  useEffect(() => {
    if (addressName) {
      setOpenAddress(addressName);
    } else {
      setOpenAddress(null);
    }
  }, [addressName]);

  return (
    <>
      <div className="flex flex-col justify-start rounded-md">
        <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">
          <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">Overview</h1>
          <div className="bg-white rounded-md shadow-md p-4">
            <ErrorBoundary fallback={<div>Error loading data</div>}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Address</TableHead>
                    <TableHead className="text-black">Program</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {addressOverviewData?.map((item, index) => (
                    <TableRow key={index} className="h-36">
                      <TableCell>
                        <Sheet
                          open={openAddress === item.street_address}
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setOpenAddress(item.street_address);
                            } else {
                              setOpenAddress(null);
                            }
                          }}
                        >
                          <SheetTrigger
                            className="text-som-primary underline text-left"
                            onClick={() => setOpenAddress(item.street_address)}
                          >
                            {item.street_address}
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle className="text-2xl">{item.street_address}</SheetTitle>
                              <SheetDescription>
                                <>
                                  City: {item.city}
                                  <br />
                                  State: {item.state}
                                  <br />
                                  Zipcode: {item.zipcode}
                                  <br />
                                  PFAS Site Name:{" "}
                                  <Link
                                    href={`/dashboard/sites?siteName=${encodeURIComponent(item.site_name)}`}
                                    className="text-som-primary underline"
                                  >
                                    {item.site_name}
                                  </Link>
                                </>
                                <br />
                                <>Toxicologist: {item.toxicologist}</>
                                <br />
                                <>EQA: {item.eqa}</>
                              </SheetDescription>
                              <hr className="my-4 border-gray-300" />
                              <div id="owner-info">
                                <p className="text-lg">Owner Information</p>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      {ownerInfoTableColumns.map((column, index) => (
                                        <TableHead key={index}>{column.label}</TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {item.owners.map((owner: Owner, index) => (
                                      <TableRow key={index}>
                                        {ownerInfoTableColumns.map((column, index) => (
                                          <TableCell key={index}>{owner[column.key]}</TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              {item.tenants.some((tenant) => tenant.name) && (
                                <>
                                  <hr className="my-4 border-gray-300" />
                                  <div id="tenant-info">
                                    <p className="text-lg">Tenant Information</p>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          {tenantInfoTableColumns.map((column, index) => (
                                            <TableHead key={index}>{column.label}</TableHead>
                                          ))}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {item.tenants.map((tenant: Tenant, index) => (
                                          <TableRow key={index}>
                                            {tenantInfoTableColumns.map((column, index) => (
                                              <TableCell key={index}>{tenant[column.key]}</TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </>
                              )}
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                      <TableCell>
                        <ProgramsList programs={item.programs} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
