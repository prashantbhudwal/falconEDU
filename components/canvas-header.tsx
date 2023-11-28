import { ColorOption, ThemeColor } from "@/types";
import { colors } from "../lib/theme/colors";
export type HeaderProps = {
  className?: string;
  color?: ColorOption;
  heading?: React.ReactNode;
  subheading?: React.ReactNode;
  leftTop?: React.ReactNode;
  leftBottom?: React.ReactNode;
  rightTop?: React.ReactNode;
  rightBottom?: React.ReactNode;
  isSticky?: boolean;
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
  isSticky = false,
}: HeaderProps) {
  const { text, h1, h2, border, bg } = colors[color] as ThemeColor;
  return (
    <header
      className={`font-medium ${text} border-b border-solid ${border} flex w-full flex-row justify-between px-1 py-2 ${
        isSticky && "sticky top-0 z-40"
      } ${bg} items-center ${className}`}
    >
      <div className="flex flex-col gap-1 text-left text-xs">
        <div>{leftTop}</div>
        <div className=" w-10">{leftBottom}</div>
      </div>
      <div className="max-w-xl text-center">
        {heading && <h1 className={`text-lg ${h1}`}>{heading}</h1>}
        {subheading && <p className={`text-base ${h2}`}>{subheading}</p>}
      </div>
      <div className="flex flex-col gap-1 text-left text-xs">
        <div>{rightTop}</div>
        <div>{rightBottom}</div>
      </div>
    </header>
  );
}
