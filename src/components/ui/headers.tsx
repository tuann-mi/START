import React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  children,
  title,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return <h1 className={cn("text-xl mb-4 text-gray-900 dark:text-white font-bold", className)}>{title || children}</h1>;
}

export function PageHeader({
  children,
  title,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <h1 className={cn("text-3xl mb-4 text-gray-900 dark:text-white font-bold", className)}>{title || children}</h1>
  );
}

export function ChartHeader({
  children,
  title,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return <h3 className={cn("text-lg font-semibold mb-4", className)}>{title || children}</h3>;
}
