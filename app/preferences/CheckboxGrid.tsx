import { motion } from "framer-motion";

type PredictionGridProps = {
  content: string[];
  selectedOptions: string[]; // Change this line
  handleChange: (event: any) => void;
};

export default function CheckboxGrid({
  content,
  selectedOptions,
  handleChange,
}: PredictionGridProps) {
  const contentString = content.join("");
  const contentWithoutNewLines = contentString.replace(/\n/g, "");
  const contentArray = contentString
    .replace(/\n/g, "")
    .replace(/\$\$(?:(?!\$\$|\n).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");

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
              selectedOptions.includes(topic)
                ? "bg-emerald-500 text-slate-800"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            <input
              type="checkbox"
              id={`topic-${index}`}
              name="topics"
              value={topic}
              checked={selectedOptions.includes(topic)}
              onChange={handleChange}
              className="hidden"
            />
            {topic}
          </motion.label>
        ))}
      </div>
    </div>
  );
}
