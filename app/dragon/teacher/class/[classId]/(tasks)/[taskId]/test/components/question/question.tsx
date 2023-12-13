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
          Answer
        </AccordionTrigger>
        <AccordionContent className={cn(AccordionContentStyle)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
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
