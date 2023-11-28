import { ColorOption } from "@/types";
import { colors } from "../lib/theme/colors";
import { ThemeColor } from "@/types";
export default function Box({
  children,
  className,
  color = "primary",
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  color?: ColorOption;
  rest?: any;
}) {
  const { ring, shadow, bg, textBase } = colors[color] as ThemeColor;

  return (
    <div
      className={`rounded-lg p-3 ring-2${ring} ${shadow} ${bg} ${textBase} w-full shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
