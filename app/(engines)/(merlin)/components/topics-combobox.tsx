"use client";
import { subtopicsAtom } from "@/lib/atoms/preferences";
import { subtopicAtom } from "@/lib/atoms/preferences";
import { useAtom } from "jotai";
import * as React from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
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

export function TopicsCombobox() {
  const [subtopics] = useAtom(subtopicsAtom);
  const [subtopic, setSubtopic] = useAtom(subtopicAtom);
  const [open, setOpen] = React.useState(false);

  const formattedTopics = subtopics.map((subtopics) => ({
    value: subtopics,
    label: subtopics,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {subtopic ? subtopic : "Select topic..."}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search topic..." />
          <CommandEmpty>No topic found.</CommandEmpty>
          <CommandGroup>
            {formattedTopics.map((topic) => (
              <CommandItem
                key={topic.value}
                value={topic.value}
                onSelect={(currentValue) => {
                  setSubtopic(currentValue === subtopic ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <LuCheck
                  className={cn(
                    "mr-2 h-4 w-4",
                    subtopic === topic.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {topic.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
