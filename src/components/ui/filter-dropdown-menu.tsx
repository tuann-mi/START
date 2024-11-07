import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { months, years, programs } from "@/lib/constants";

export default function FilterDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const handleYearChange = (checked: boolean, year: string) => {
    setSelectedYears((prev) => (checked ? [...prev, year] : prev.filter((item) => item !== year)));
  };

  const handleMonthChange = (checked: boolean, month: string) => {
    setSelectedMonths((prev) => (checked ? [...prev, month] : prev.filter((item) => item !== month)));
  };

  const handleProgramChange = (checked: boolean, program: string) => {
    setSelectedPrograms((prev) => (checked ? [...prev, program] : prev.filter((item) => item !== program)));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger className="bg-som-primary text-white hover:underline flex flex-row items-center px-4 py-2 rounded-md">
        <FilterIcon className="w-4 h-4 mr-2" />
        Filters
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent mr-8"
        sideOffset={6}
      >
        <DropdownMenuLabel>
          <Accordion type="multiple" defaultValue={["year", "month", "program"]}>
            <AccordionItem value="year">
              <AccordionTrigger>Year</AccordionTrigger>
              <AccordionContent>
                <DropdownMenuCheckboxItem
                  checked={selectedYears.length === years.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedYears(years);
                    } else {
                      setSelectedYears([]);
                    }
                  }}
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                  className="w-full hover:cursor-pointer hover:bg-gray-100"
                >
                  Select All
                </DropdownMenuCheckboxItem>
                {years.map((year) => (
                  <DropdownMenuCheckboxItem
                    key={year}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={(checked) => handleYearChange(checked, year)}
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                    className="w-full hover:cursor-pointer hover:bg-gray-100"
                  >
                    {year}
                  </DropdownMenuCheckboxItem>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="month">
              <AccordionTrigger>Month</AccordionTrigger>
              <AccordionContent>
                <DropdownMenuCheckboxItem
                  checked={selectedMonths.length === months.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMonths(months);
                    } else {
                      setSelectedMonths([]);
                    }
                  }}
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                  className="w-full hover:cursor-pointer hover:bg-gray-100"
                >
                  Select All
                </DropdownMenuCheckboxItem>
                {months.map((month) => (
                  <DropdownMenuCheckboxItem
                    key={month}
                    checked={selectedMonths.includes(month)}
                    onCheckedChange={(checked) => handleMonthChange(checked, month)}
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                    className="w-full hover:cursor-pointer hover:bg-gray-100"
                  >
                    {month}
                  </DropdownMenuCheckboxItem>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="program">
              <AccordionTrigger>Program</AccordionTrigger>
              <AccordionContent>
                <DropdownMenuCheckboxItem
                  checked={selectedPrograms.length === programs.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPrograms(programs);
                    } else {
                      setSelectedPrograms([]);
                    }
                  }}
                  onSelect={(event) => {
                    event.preventDefault();
                  }}
                  className="w-full hover:cursor-pointer hover:bg-gray-100"
                >
                  Select All
                </DropdownMenuCheckboxItem>
                {programs.map((program) => (
                  <DropdownMenuCheckboxItem
                    key={program}
                    checked={selectedPrograms.includes(program)}
                    onCheckedChange={(checked) => handleProgramChange(checked, program)}
                    onSelect={(event) => {
                      event.preventDefault();
                    }}
                    className="w-full hover:cursor-pointer hover:bg-gray-100"
                  >
                    {program}
                  </DropdownMenuCheckboxItem>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
