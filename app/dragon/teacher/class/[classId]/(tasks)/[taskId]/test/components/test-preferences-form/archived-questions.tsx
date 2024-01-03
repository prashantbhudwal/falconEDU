"use client";
import { typeActiveParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import {
  Answer,
  Option,
  Options,
  Question,
  QuestionText,
} from "../question/question";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuArchiveRestore } from "react-icons/lu";
import { useState } from "react";
import { db } from "@/app/dragon/teacher/routers";

type PropTypes = {
  archivedQuestions: typeActiveParsedQuestionByBotConfigId[] | null;
};
export const ArchivedQuestions = ({ archivedQuestions }: PropTypes) => {
  const [error, setError] = useState("");
  const restoreQuestionHandler = ({ id }: { id: string }) => {
    try {
      setError("");
      const questions = db.parseQuestionRouter.unarchiveParsedQuestion({
        parsedQuestionId: id,
      });
    } catch (err) {
      setError("Can't restore Question");
    }
  };
  return (
    <>
      {archivedQuestions && archivedQuestions.length > 0 ? (
        <>
          {archivedQuestions.map((question) => {
            return (
              <div key={question.id} className="mb-5">
                <Question>
                  {/* ---------------------------------- Questions -------------------------------------- */}
                  <div className="flex w-full justify-between gap-5">
                    <QuestionText
                      questionNumber={question.question_number}
                      className="w-full text-slate-500"
                    >
                      <div className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-lg w-full">
                        {question.question}
                      </div>
                    </QuestionText>
                    <div className="flex items-center gap-1 self-start">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <button
                              type="button"
                              onClick={() =>
                                restoreQuestionHandler({ id: question.id })
                              }
                              className="cursor-pointer rounded-full hover:bg-base-100 hover:shadow-slate-700 hover:shadow-sm h-fit p-2 hover:text-base-content text-slate-300"
                            >
                              <LuArchiveRestore />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-600 text-slate-100">
                            Restore Question
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end -translate-y-4">
                    {error && (
                      <p className="text-xs whitespace-nowrap font-medium text-red-400">
                        {error}
                      </p>
                    )}
                  </div>
                  {/* -------------------------------------- Options -------------------------------- */}
                  {question.options.length > 0 && (
                    <Options>
                      {question.options.map((option, index) => {
                        return (
                          <Option key={index}>
                            <div className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-[16px] text-slate-500">
                              {option}
                            </div>
                          </Option>
                        );
                      })}
                    </Options>
                  )}
                  {/* ----------------------------------------- Answers -------------------------------- */}
                  {question.correct_answer.length > 0 && (
                    <Answer accordianTitleStyles="text-slate-500">
                      {question.correct_answer.map((answer, index) => (
                        <div
                          className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-slate-500"
                          key={index}
                        >
                          {answer}
                        </div>
                      ))}
                    </Answer>
                  )}
                  {/* ---------------------------------------------------------------------------------------------------- */}
                </Question>
              </div>
            );
          })}
        </>
      ) : (
        <div className="py-5 text-lg w-full flex justify-center items-center">
          No Questions Found
        </div>
      )}
    </>
  );
};
