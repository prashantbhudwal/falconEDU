import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { LuChevronsUpDown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";

/**
 * Renders a combox component.
 * Always use this inside the FormProvider from react-hook-form
 */
const ComboBox = ({
  items,
  placeholder,
  ...field
}: {
  items: string[];
  placeholder: string;
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { getValues, setValue } = useFormContext();

  const { value } = field as { value: string; label: string };

  const formatedItems = items.map((item) => {
    return {
      label: item,
      value: item.toLowerCase(),
    };
  });

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={popoverOpen}
          className="min-w-fit max-w-fit justify-between"
        >
          {value && value.length > 0
            ? formatedItems.find((item) => item.value === value[0])?.label
            : placeholder}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-fit min-w-fit p-0 h-[400px]">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="h-full overflow-y-scroll custom-scrollbar">
            {formatedItems.map((item) => {
              return (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(
                      "subjects",
                      currentValue === value[0] ? [] : [currentValue]
                    );
                    setPopoverOpen(false);
                  }}
                >
                  <FaCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      value[0] === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
