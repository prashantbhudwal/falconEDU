type QuestionProps = {
  index: number;
  question: {
    question?: string;
    options?: string[];
  };
  onClick?: () => void;
};

const Question: React.FC<QuestionProps> = ({ index, question, onClick }) => {
  return (
    <div className="text-sm" onClick={onClick}>
      {index}. {question.question}
      <div className="pt-2">
        {"options" in question &&
          Array.isArray(question.options) && // type guard
          question.options.map((option: string, optIndex: number) => (
            <div key={optIndex} className="flex flex-row gap-2">
              <div>{option}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Question;
