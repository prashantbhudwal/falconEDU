import { cn } from "@/lib/utils";
import { Button, buttonVariants, ButtonProps } from "./button"; // Adjust the import path as needed

import * as React from "react";

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, children, className, ...props }, ref) => {
    // Ensure items are centered and space is added between icon and text
    const iconButtonClassNames = cn(
      "inline-flex items-center space-x-2", // This ensures the icon and text are centered and spaced
      className, // Allows custom classes to be passed in and applied
    );

    return (
      <Button
        ref={ref}
        className={cn(
          "flex items-center space-x-2", // This ensures the icon and text are centered and spaced
          className, // Allows custom classes to be passed in and applied
        )}
        {...props}
      >
        {icon}
        <span>{children}</span>
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
