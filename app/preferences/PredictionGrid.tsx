type PredictionGridProps = {
  content: string[];
  selectedOption: string;
  handleChange: (event: any) => void;
};

export default function PredictionGrid({
  content,
  selectedOption,
  handleChange,
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl text-slate-600">Or just select one...</div>
      <div className="flex flex-row gap-2 flex-wrap w-4/5 justify-center">
        {contentArray.map((topic, index) => (
          <label
            key={index}
            htmlFor={`topic-${index}`}
            className={`py-3 px-6 w-96 rounded-full cursor-pointer shadow-md shadow-slate-800 ${
              selectedOption === topic
                ? "bg-emerald-500 text-slate-900"
                : "bg-slate-300 text-slate-900"
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
