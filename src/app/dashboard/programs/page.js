import { React, Suspense } from "react";

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Programs</div>
    </Suspense>
  );
}