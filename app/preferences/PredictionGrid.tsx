import { ColorOption, Theme, ThemeColor } from "@/types";
import { colors } from "../theme/colors";
type PredictionGridProps = {
  content: string[];
  selectedOption: string;
  handleChange: (event: any) => void;
  className?: string;
};

export default function PredictionGrid({
  content,
  selectedOption,
  handleChange,
  className = "bg-primary",
}: PredictionGridProps) {
  const contentString = content.join("");

  const contentWithoutNewLines = contentString.replace(/\n/g, "");
  const contentArray = contentString
    .replace(/\n/g, "")
    .replace(/\$\$(?:(?!\$\$|\n).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-md text-slate-500">Or just select one...</div>
      <div className="flex flex-row gap-3 flex-wrap w-4/5 justify-center">
        {contentArray.map((topic, index) => (
          <label
            key={index}
            htmlFor={`topic-${index}`}
            className={`text-sm hover:scale-105 py-2 px-5 w-96 rounded-md cursor-pointer ${
              selectedOption === topic
                ? `${className} text-slate-900`
                : "bg-slate-800 text-slate-300"
            }`}
          >
            <input
              type="radio"
              id={`topic-${index}`}
              name="topics"
              value={topic}
              checked={selectedOption === topic}
              onChange={handleChange}
              className="hidden" // This hides the default radio button
            />
            {topic}
          </label>
        ))}
      </div>
    </div>
  );
}
