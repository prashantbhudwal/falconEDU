import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const paperVariants = cva("", {
  variants: {
    variant: {
      default: "shadow-md rounded-sm shadow-base-300 p-8",
      form: "space-y-10 m-10 lg:mx-32 rounded-sm p-10 shadow-inner shadow-slate-700 hover:transition-all duration-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface PaperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paperVariants> {}

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(paperVariants({ variant, className }))}
      {...props}
    />
  )
);
Paper.displayName = "Paper";

export { Paper };
