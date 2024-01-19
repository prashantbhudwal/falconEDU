"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@/components/ui/accordion";
import { BsFillInfoCircleFill } from "react-icons/bs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";
import { typeActiveParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { Button } from "@/components/ui/button";
import { db } from "@/app/dragon/teacher/routers";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ParsedQuestionType = typeActiveParsedQuestionByBotConfigId;

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

type QuestionProps = CommonProps & {
  isCorrect?: boolean;
};

type AccordionProps = CommonProps & {
  hidden?: boolean;
  accordianTitleStyles?: string;
  question?: ParsedQuestionType;
};
type QuestionTextProps = CommonProps & {
  questionNumber?: number;
};

const AccordionHeaderStyle = `text-sm text-base leading-none tracking-tight rounded-sm text-slate-400 pb-2 font-normal`;
const AccordionContentStyle = `pl-2 text-slate-400 text-base text-sm`;

const Question = React.forwardRef<HTMLDivElement, QuestionProps>(
  ({ children, className, isCorrect, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          className,
          "py-2 px-4 text-slate-300",

          {
            "ring-1 ring-primary": isCorrect,
            "ring-1 ring-destructive": isCorrect !== undefined && !isCorrect,
          }
        )}
      >
        {children}
      </Card>
    );
  }
);
Question.displayName = "Question";

const QuestionText = React.forwardRef<HTMLHeadingElement, QuestionTextProps>(
  ({ children, className, questionNumber }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "leading-none tracking-tight flex flex-row items-baseline",
        className
      )}
    >
      {questionNumber && <span className="mr-1">{questionNumber}.</span>}
      <div className="w-full">{children}</div>
    </h2>
  )
);
QuestionText.displayName = "QuestionText";

const Options = React.forwardRef<HTMLDivElement, CommonProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 pl-2 my-3", className)}
    >
      {children}
    </div>
  )
);
Options.displayName = "Options";

const Option = React.forwardRef<HTMLDivElement, CommonProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn("border rounded-md p-1 pl-2 text-xs", className)}
    >
      {children}
    </div>
  )
);
Option.displayName = "Option";

const Answer = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, className, hidden, question, accordianTitleStyles }, ref) => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const removeWarningHandler = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!question) return;
      setError("");

      const { success } = await db.parseQuestionRouter.updateParsedQuestion({
        parseQuestionId: question.id,
        data: {
          isPossiblyWrong: false,
          isPossiblyWrongDesc: "",
        } as ParsedQuestionType,
      });

      if (!success) {
        setError("Can't remove warning");
      }

      if (success) {
        setError("");
      }
    };
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={!hidden ? "item-1" : undefined}
        ref={ref}
        className={cn("", className)}
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger
            className={cn(
              AccordionHeaderStyle,
              accordianTitleStyles,
              "hover:no-underline cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3">
              Answer
              {question?.isPossiblyWrong && question?.isPossiblyWrongDesc && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger className="group">
                      <div className="flex gap-4 items-center">
                        <div className="text-warning flex gap-2 text-xs items-center hover:underline">
                          <BsFillInfoCircleFill className="text-xs" /> Possibly
                          incorrect.
                        </div>
                        <button
                          onClick={removeWarningHandler}
                          className="w-fit group-hover:block rounded-full hover:text-slate-100 text-sm hidden text-slate-500"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </TooltipTrigger>
                    {error && <p className="text-xs text-error">{error}</p>}
                    <TooltipContent className="bg-slate-700 text-slate-100 text-start max-w-[400px] cursor-default">
                      <div className="">
                        <h3 className="text-lg font-medium text-slate-300">
                          Answer Verification
                        </h3>
                        <p className="text-xs pt-3 pb-1">Provided Answer:</p>
                        <div className="flex flex-col gap-2 px-3 py-2 border border-slate-500 rounded-lg">
                          {question.correct_answer.map((answer, index) => {
                            return <p key={index}>{answer}</p>;
                          })}
                        </div>
                        <p className="text-slate-100 text-sm py-3">
                          {question.isPossiblyWrongDesc}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className={cn(AccordionContentStyle)}>
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
);
Answer.displayName = "Answer";

const StudentResponse = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, className, hidden, accordianTitleStyles }, ref) => (
    <Accordion
      type="single"
      collapsible
      defaultValue={!hidden ? "item-1" : undefined}
      ref={ref}
      className={cn("", className)}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(AccordionHeaderStyle, accordianTitleStyles)}
        >
          Student Response
        </AccordionTrigger>

        <AccordionContent className={cn(AccordionContentStyle)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
);

StudentResponse.displayName = "StudentResponse";

const Hint = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, className, hidden, accordianTitleStyles }, ref) => (
    <Accordion
      type="single"
      collapsible
      defaultValue={!hidden ? "item-1" : undefined}
      ref={ref}
      className={cn("", className)}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(AccordionHeaderStyle, accordianTitleStyles)}
        >
          Hint
        </AccordionTrigger>
        <AccordionContent className={cn(AccordionContentStyle)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
);

Hint.displayName = "Hint";

export {
  Question,
  QuestionText,
  Options,
  Option,
  Answer,
  StudentResponse,
  Hint,
};
