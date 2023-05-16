import { ColorOption } from "@/types";
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
  let ringColorClass = "";
  let shadowColorClass = "";

  if (color === "primary") {
    ringColorClass = "ring-emerald-500";
    shadowColorClass = "shadow-emerald-500";
  } else if (color === "secondary") {
    ringColorClass = "ring-fuchsia-500";
    shadowColorClass = "shadow-fuchsia-500";
  } else if (color === "gray") {
    ringColorClass = "ring-slate-500";
    shadowColorClass = "shadow-slate-500";
  }

  return (
    <div
      className={`px-3 py-3 rounded-lg ring-2 ${ringColorClass} ${shadowColorClass} shadow-sm w-full ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
