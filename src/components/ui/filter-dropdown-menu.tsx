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

interface FilterSection {
  id: string;
  title: string;
  options: string[];
}

interface FilterDropdownProps {
  sections: FilterSection[];
  onFilterChange?: (sectionId: string, selectedItems: string[]) => void;
  triggerIcon?: React.ReactNode;
  triggerText?: string;
  className?: string;
}

export default function FilterDropdown({
  sections,
  onFilterChange,
  triggerIcon = <FilterIcon className="w-4 h-4 mr-2" />,
  triggerText = "Filters",
  className = "bg-som-primary text-white hover:underline",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const handleItemChange = (sectionId: string, checked: boolean, item: string) => {
    setSelectedItems((prev) => {
      const newItems = checked ? [...(prev[sectionId] || []), item] : (prev[sectionId] || []).filter((i) => i !== item);

      const updatedState = {
        ...prev,
        [sectionId]: newItems,
      };

      onFilterChange?.(sectionId, newItems);
      return updatedState;
    });
  };

  const handleSelectAll = (sectionId: string, checked: boolean, options: string[]) => {
    setSelectedItems((prev) => {
      const updatedState = {
        ...prev,
        [sectionId]: checked ? [...options] : [],
      };

      onFilterChange?.(sectionId, updatedState[sectionId]);
      return updatedState;
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger className={`flex flex-row items-center px-4 py-2 rounded-md ${className}`}>
        {triggerIcon}
        {triggerText}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent mr-8 min-w-[200px]"
        sideOffset={6}
      >
        <DropdownMenuLabel>
          <Accordion type="multiple" defaultValue={sections.map((section) => section.id)}>
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <DropdownMenuCheckboxItem
                    checked={
                      Array.isArray(section.options) &&
                      section.options.length > 0 &&
                      selectedItems[section.id]?.length === section.options.length
                    }
                    onCheckedChange={(checked) => handleSelectAll(section.id, checked, section.options)}
                    onSelect={(event) => event.preventDefault()}
                    className="w-full hover:cursor-pointer hover:bg-gray-100"
                  >
                    Select All
                  </DropdownMenuCheckboxItem>
                  {section.options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option}
                      checked={selectedItems[section.id]?.includes(option)}
                      onCheckedChange={(checked) => handleItemChange(section.id, checked, option)}
                      onSelect={(event) => event.preventDefault()}
                      className="w-full hover:cursor-pointer hover:bg-gray-100"
                    >
                      {option}
                    </DropdownMenuCheckboxItem>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
