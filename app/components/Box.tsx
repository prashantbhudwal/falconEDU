import { ColorOption } from "@/types";
import { colors } from "../theme/colors";
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
  const { ring, shadow } = colors[color] as ThemeColor;

  return (
    <div
      className={`px-3 py-3 rounded-lg ring-2 ${ring} ${shadow} shadow-sm w-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
