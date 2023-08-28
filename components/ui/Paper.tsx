import * as React from "react";

import { cn } from "@/lib/utils";

const Paper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "max-w-5xl w-5/6 shadow-md rounded-sm shadow-base-300 my-4 p-4",
      className
    )}
    {...props}
  />
));
Paper.displayName = "Paper";

export { Paper };
