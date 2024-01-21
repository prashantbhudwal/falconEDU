import * as React from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
type Item = {
  value: string;
  label: string;
};

type ComboboxProp = {
  items: Item[];
  placeholderText?: string;
  className?: string;
  popoverClassName?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Combobox = function ({
  items,
  placeholderText = "Select an item...",
  className,
  popoverClassName,
  value,
  setValue,
}: ComboboxProp) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(" justify-between")}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholderText}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", popoverClassName)}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {item.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
