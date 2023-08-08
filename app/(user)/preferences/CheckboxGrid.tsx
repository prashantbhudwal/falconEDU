type PredictionGridProps = {
  content: string[];
  selectedOptions: string[]; // Change this line
  handleChange: (event: any) => void;
  userFlow: string;
};

export default function CheckboxGrid({
  content,
  selectedOptions,
  handleChange,
  userFlow,
}: PredictionGridProps) {
  const contentString = content.join("");
  const contentWithoutNewLines = contentString.replace(/\n/g, "");
  const contentArray = contentString
    .replace(/\n/g, "")
    .replace(/\$\$(?:(?!\$\$|\n).)*\$\$/g, (match) => match.slice(2, -2))
    .split("_");

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-slate-500 mb-2">
        Or choose as many from the list...
      </div>
      <div className="flex flex-row gap-3 flex-wrap w-4/5 justify-center">
        {contentArray.map((topic, index) => (
          <label
            key={index}
            htmlFor={`topic-${index}`}
            className={`text-sm hover:scale-105 py-2 px-5 w-96 rounded-md cursor-pointer ${
              selectedOptions.includes(topic)
                ? `${
                    userFlow === "worksheet" ? "bg-secondary" : "bg-primary"
                  } text-slate-800`
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
          </label>
        ))}
      </div>
    </div>
  );
}
