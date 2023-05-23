import { ColorOption, ThemeColor } from "@/types";
import { colors } from "../theme/colors";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  color?: ColorOption;
  className?: string;
  headingColor?: string;
  dividerColor?: string;
};

const Section: React.FC<SectionProps> = ({
  title,
  children,
  color = "primary",
  className,
  headingColor,
  dividerColor,
}) => {
  const { text, border, bg } = colors[color] as ThemeColor;
  if (!headingColor) headingColor = text;
  if (!dividerColor) dividerColor = border;
  return (
    <div className={`pt-3  ${bg} ${className}`}>
      <header
        className={` ${dividerColor} ${headingColor} text-left font-medium border-b border-solid pb-2 mb-4`}
      >
        <p className="capitalize">{title}</p>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default Section;
