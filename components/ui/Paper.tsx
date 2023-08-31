import * as React from "react";

import { cn } from "@/lib/utils";

const Paper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shadow-md rounded-sm shadow-base-300 p-8", className)}
    {...props}
  />
));
Paper.displayName = "Paper";

export { Paper };
