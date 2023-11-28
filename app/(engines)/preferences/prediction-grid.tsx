import { ColorOption, Theme, ThemeColor } from "@/types";
import { colors } from "../../../lib/theme/colors";
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
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-md text-slate-500">Or just select one...</div>
      <div className="flex w-4/5 flex-row flex-wrap justify-center gap-3">
        {content.map((topic, index) => (
          <label
            key={index}
            htmlFor={`topic-${index}`}
            className={`w-96 cursor-pointer rounded-md px-5 py-2 text-sm hover:scale-105 ${
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
