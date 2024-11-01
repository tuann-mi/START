import React, { Suspense } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionContainer, SubSectionContainer } from "@/components/ui/content-containers";
import { SectionHeader } from "@/components/ui/headers";

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SectionContainer>
        <SectionHeader>Overview</SectionHeader>
        <SubSectionContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Program</TableHead>
                <TableHead className="text-black">Section</TableHead>
                <TableHead className="text-black">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Lead</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Person Person</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </SubSectionContainer>
      </SectionContainer>
    </Suspense>
  );
}
