
type ColorOption = "primary" | "secondary" | "gray";

type CanvasHeaderProps = {
  className?: string;
  color?: ColorOption;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  leftTop?: React.ReactNode;
  leftBottom?: React.ReactNode;
  rightTop?: React.ReactNode;
  rightBottom?: React.ReactNode;
};

export default function CanvasHeader({
  className,
  color = "primary",
  heading,
  subheading,
  leftTop,
  leftBottom,
  rightTop,
  rightBottom,
}: CanvasHeaderProps) {
  let textColorClass = "";
  let borderClass = "";

  if (color === "primary") {
    textColorClass = "text-emerald-600";
    borderClass = "border-emerald-700";
  } else if (color === "secondary") {
    textColorClass = "text-fuchsia-600";
    borderClass = "border-fuchsia-700";
  } else if (color === "gray") {
    textColorClass = "text-slate-600";
    borderClass = "border-slate-700";
  }

  return (
    <header
      className={`font-medium ${textColorClass} border-b border-solid ${borderClass} pb-2 flex flex-row justify-between w-full items-center ${className}`}
    >
      <div className="text-left">
        {leftTop}
        {leftBottom}
      </div>
      <div className="text-center max-w-xl">
        {heading && <h1 className="text-2xl">{heading}</h1>}
        {subheading && (
          <p className={`text-lg ${textColorClass}`}>{subheading}</p>
        )}
      </div>
      <div className="text-sm text-left">
        {rightTop}
        {rightBottom}
      </div>
    </header>
  );
}
