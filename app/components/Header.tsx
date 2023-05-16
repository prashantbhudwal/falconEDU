import { ColorOption } from "@/types";
export type HeaderProps = {
  className?: string;
  color?: ColorOption;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  leftTop?: React.ReactNode;
  leftBottom?: React.ReactNode;
  rightTop?: React.ReactNode;
  rightBottom?: React.ReactNode;
};

export default function Header({
  className,
  color = "primary",
  heading,
  subheading,
  leftTop,
  leftBottom,
  rightTop,
  rightBottom,
}: HeaderProps) {
  let textColorClass = "";
  let borderClass = "";
  let backgroundColorClass = "";
  let subheadingColorClass = "";
  let headingColorClass = "";

  if (color === "primary") {
    textColorClass = "text-emerald-500";
    subheadingColorClass = "text-emerald-600";
    headingColorClass = "text-emerald-400";
    borderClass = "border-emerald-700";
    backgroundColorClass = "bg-slate-900";
  } else if (color === "secondary") {
    textColorClass = "text-fuchsia-500";
    subheadingColorClass = "text-fuchsia-600";
    headingColorClass = "text-fuchsia-400";
    borderClass = "border-fuchsia-700";
    backgroundColorClass = "bg-slate-900";
  } else if (color === "gray") {
    textColorClass = "text-slate-500";
    subheadingColorClass = "text-slate-500";
    headingColorClass = "text-slate-800";
    borderClass = "border-slate-700";
    backgroundColorClass = "bg-slate-100";
  } else if (color === "black") {
    textColorClass = "text-slate-500";
    subheadingColorClass = "text-slate-600";
    headingColorClass = "text-slate-800";
    borderClass = "border-slate-600";
    backgroundColorClass = "bg-slate-100";
  }

  return (
    <header
      className={`font-medium ${textColorClass} border-b border-solid ${borderClass} py-3 flex flex-row justify-between w-full sticky top-0 z-50 ${backgroundColorClass} items-center ${className}`}
    >
      <div className="text-sm text-left flex flex-col gap-1">
        <div>{leftTop}</div>
        <div className="text-sm w-10">{leftBottom}</div>
      </div>
      <div className="text-center max-w-xl">
        {heading && (
          <h1 className={`text-2xl ${headingColorClass}`}>{heading}</h1>
        )}
        {subheading && (
          <p className={`text-lg ${subheadingColorClass}`}>{subheading}</p>
        )}
      </div>
      <div className="text-sm text-left flex-col flex gap-1">
        <div>{rightTop}</div>
        <div>{rightBottom}</div>
      </div>
    </header>
  );
}
