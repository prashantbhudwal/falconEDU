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
    <div className={`pt-2  ${bg} ${className}`}>
      <header
        className={`${headingColor} mb-2 text-left`}
      >
        <p className="text-sm capitalize">{title}</p>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default Section;
