import React from "react";
import { cn } from "@/lib/utils";

export function SectionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full", className)}>
      {children}
    </div>
  );
}

export function SubSectionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white rounded-md shadow-md p-4", className)}>{children}</div>;
}

export function ChartGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>{children}</div>;
}

export function ChartContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white rounded-md shadow-md p-4", className)}>{children}</div>;
}
