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
      "mx-2 h-8 w-full min-w-[50px] rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-[1.2]  active:scale-90   data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 data-[state=checked]:shadow-inherit",
      className,
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
