import { ColorOption, Theme, ThemeColor } from "@/types";
import { motion } from "framer-motion";
import { colors } from "../theme/colors";
type PredictionGridProps = {
  content: string[];
  selectedOption: string;
  handleChange: (event: any) => void;
  color?: ColorOption;
};

export default function PredictionGrid({
  content,
  selectedOption,
  handleChange,
  color = "primary",
}: PredictionGridProps) {
  const contentString = content.join("");
  // console.log("topics", contentString);

  const contentWithoutNewLines = contentString.replace(/\n/g, "");
  // console.log(contentWithoutNewLines);
  const contentArray = contentString
    .replace(/\n/g, "")
    .replace(/\$\$(?:(?!\$\$|\n).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");
  // console.log("topicArray", contentArray);
  const { bgColor } = colors[color] as ThemeColor;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl text-slate-500">Or just select one...</div>
      <div className="flex flex-row gap-3 flex-wrap w-4/5 justify-center">
        {contentArray.map((topic, index) => (
          <motion.label
            whileHover={{ scale: 1.05 }}
            key={index}
            htmlFor={`topic-${index}`}
            className={`py-3 px-6 w-96 rounded-full cursor-pointer ${
              selectedOption === topic
                ? `${bgColor} text-slate-900`
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
          </motion.label>
        ))}
      </div>
    </div>
  );
}
