import { cn } from "../lib/utils";

export function FooterText({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("px-2 text-center text-xs leading-normal", className)}
      {...props}
    ></p>
  );
}
