"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
export default function Addresses() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const searchParams = useSearchParams();
  const addressName = searchParams.get("address");
  const [openAddress, setOpenAddress] = useState(null);

  useEffect(() => {
    if (addressName) {
      setOpenAddress(addressName);
    } else {
      setOpenAddress(null);
    }
  }, [addressName]);

  useEffect(() => {
    setIsLoading(true);
    if (typeof window !== "undefined") {
      // Check if sessionStorage is available
      const storedData = sessionStorage.getItem("addressesData");
      if (storedData) {
        console.log("storedData", JSON.parse(storedData));
        setData(JSON.parse(storedData));
        setIsLoading(false);
        console.log("Data loaded from sessionStorage");
      } else {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/address-overview");
            const data = await response.json();
            setData(data);
            sessionStorage.setItem("addressesData", JSON.stringify(data));
            console.log("Data fetched and stored in sessionStorage");
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

  if (isLoading) {
    return (
      <>
        <PageHeader title="Addresses" />
        <div className="flex flex-col justify-start rounded-md">
          <Skeleton className="w-full h-[500px] bg-gray-100 dark:bg-gray-800" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Addresses" />
      <div className="flex flex-col justify-start rounded-md">
        <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">
          <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">
            Overview
          </h1>
          <div className="bg-white rounded-md shadow-md p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Address</TableHead>
                  <TableHead className="text-black">Site Name</TableHead>
                  <TableHead className="text-black">Program</TableHead>
                  <TableHead className="text-black">Sampling Status</TableHead>
                  <TableHead className="text-black">
                    Date Last Sampled
                  </TableHead>
                  <TableHead className="text-black">Toxicologist</TableHead>
                  <TableHead className="text-black">Project Manager</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Sheet
                        open={openAddress === item.sampled_address_clean}
                        onOpenChange={(isOpen) => {
                          if (isOpen) {
                            setOpenAddress(item.sampled_address_clean);
                          } else {
                            setOpenAddress(null);
                          }
                        }}
                      >
                        <SheetTrigger
                          className="text-som-primary underline"
                          onClick={() =>
                            setOpenAddress(item.sampled_address_clean)
                          }
                        >
                          {item.sampled_address_clean}
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>
                              {item.sampled_address_clean}
                            </SheetTitle>
                            <SheetDescription>
                              <p>
                                Site Name:{" "}
                                <Link
                                  href={`/dashboard/sites?siteName=${encodeURIComponent(
                                    item.site_name
                                  )}`}
                                  className="text-som-primary underline"
                                >
                                  {item.site_name}
                                </Link>
                              </p>
                              <p>Toxicologist: {item.toxicologist}</p>
                              <p>Project Manager: {item.project_manager}</p>
                            </SheetDescription>
                          </SheetHeader>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                    <TableCell>{item.site_name}</TableCell>
                    <TableCell>{item.sampling_type}</TableCell>
                    <TableCell>{item.sampling_status}</TableCell>
                    <TableCell>{item.date_last_sampled}</TableCell>
                    <TableCell>{item.toxicologist}</TableCell>
                    <TableCell>{item.project_manager}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
