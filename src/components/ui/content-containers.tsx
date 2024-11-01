import React from "react";

export function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">{children}</div>
  );
}

export function SubSectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-md shadow-md p-4">{children}</div>;
}
