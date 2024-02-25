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
      "w-full min-w-[50px] rounded border bg-transparent px-2 py-1 text-xs transition-all  duration-200   data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 data-[state=checked]:shadow-inherit hover:scale-[1.1] active:scale-90",
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
