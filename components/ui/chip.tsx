"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

interface CheckBoxItemProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  toggleName?: String;
}
const Chip = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckBoxItemProps
>(({ className, toggleName, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "font-medium min-w-[50px] border w-full active:scale-90 mx-2 h-8 transition-all duration-200 hover:scale-[1.2] rounded-lg  data-[state=checked]:shadow-inherit   data-[state=checked]:bg-primary data-[state=checked]:text-text-800 text-sm",
      className
    )}
    {...props}
  >
    <div className="flex justify-center gap-1">
      <div>{toggleName}</div>
    </div>
  </CheckboxPrimitive.Root>
));
Chip.displayName = CheckboxPrimitive.Root.displayName;

export { Chip };
