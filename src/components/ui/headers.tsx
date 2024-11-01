import React from "react";

export function SectionHeader({ children, title }: { children?: React.ReactNode; title?: string }) {
  return <h1 className="text-xl mb-4 text-gray-900 dark:text-white font-bold">{title || children}</h1>;
}

export function PageHeader({ children, title }: { children?: React.ReactNode; title?: string }) {
  return <h1 className="text-3xl mb-4 text-gray-900 dark:text-white font-bold">{title || children}</h1>;
}
