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
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mb-2 text-sm text-slate-500">
        Or choose as many from the list...
      </div>
      <div className="flex w-4/5 flex-row flex-wrap justify-center gap-3">
        {content.map((topic, index) => (
          <label
            key={index}
            htmlFor={`topic-${index}`}
            className={`w-96 cursor-pointer rounded-md px-5 py-2 text-sm hover:scale-105 ${
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
