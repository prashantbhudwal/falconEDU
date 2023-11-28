import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { QuestionForm } from "./question-form";

export function TestParsedQuestion({
  parsedQuestions,
}: {
  parsedQuestions: typeGetParsedQuestionByBotConfigId;
}) {
  return (
    <div className="flex flex-col space-y-3">
      {parsedQuestions &&
        parsedQuestions.length > 0 &&
        parsedQuestions.map((question) => (
          <QuestionForm key={question.id} question={question} />
        ))}
    </div>
  );
}
