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
import { ProgramBadge, ProgramsList } from "@/app/components/ProgramBadge";
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
      // const storedData = false;
      if (storedData) {
        console.log("storedData", JSON.parse(storedData));
        setData(JSON.parse(storedData));
        setIsLoading(false);
        console.log("Data loaded from sessionStorage");
      } else {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/db-queries/address-overview");
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
                  <TableHead className="text-black">Toxicologist</TableHead>
                  <TableHead className="text-black">EQA</TableHead>
                  <TableHead className="text-black">Program</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((item, index) => (
                  <TableRow key={index}>
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
                          className="text-som-primary underline"
                          onClick={() => setOpenAddress(item.street_address)}
                        >
                          {item.street_address}
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{item.street_address}</SheetTitle>
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
                    <TableCell>{item.toxicologist}</TableCell>
                    <TableCell>{item.eqa}</TableCell>
                    <TableCell>
                      <ProgramsList programs={item.programs} />
                    </TableCell>
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
