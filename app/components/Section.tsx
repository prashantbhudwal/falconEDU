import { ColorOption, ThemeColor } from "@/types";
import { colors } from "../theme/colors";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  color?: ColorOption;
};

const Section: React.FC<SectionProps> = ({
  title,
  children,
  color = "primary",
}) => {
  const { text, border, bg } = colors[color] as ThemeColor;

  return (
    <div className="pt-3">
      <header
        className={`${text} ${bg} ${border} text-left font-medium border-b border-solid pb-2 mb-4`}
      >
        <p className="capitalize">{title}</p>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default Section;
