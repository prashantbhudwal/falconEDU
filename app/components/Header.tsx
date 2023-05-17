import { ColorOption, ThemeColor } from "@/types";
import { colors } from "../theme/colors";
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
  const { text, h1, h2, border, bg } = colors[color] as ThemeColor;
  return (
    <header
      className={`font-medium ${text} border-b border-solid ${border} py-3 flex flex-row justify-between w-full sticky top-0 z-50 ${bg} items-center ${className}`}
    >
      <div className="text-sm text-left flex flex-col gap-1">
        <div>{leftTop}</div>
        <div className="text-sm w-10">{leftBottom}</div>
      </div>
      <div className="text-center max-w-xl">
        {heading && <h1 className={`text-2xl ${h1}`}>{heading}</h1>}
        {subheading && <p className={`text-lg ${h2}`}>{subheading}</p>}
      </div>
      <div className="text-sm text-left flex-col flex gap-1">
        <div>{rightTop}</div>
        <div>{rightBottom}</div>
      </div>
    </header>
  );
}
