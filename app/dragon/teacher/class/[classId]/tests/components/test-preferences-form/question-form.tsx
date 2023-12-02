"use client";
import {
  Question,
  QuestionText,
  Answer,
  Options,
  Option,
} from "../question/question";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { parsedQuestionsSchema } from "@/app/dragon/schema";
import { z } from "zod";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";

import { db } from "@/app/dragon/teacher/routers";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { LuCopy, LuTrash } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type QuestionProps = NonNullable<typeGetParsedQuestionByBotConfigId>[number];

type PropType = React.HTMLProps<HTMLDivElement> & {
  question: QuestionProps;
  questionNumber: number;
  createDuplicate: ({ data }: { data: QuestionProps }) => void;
};

export const QuestionForm = ({
  question,
  questionNumber,
  createDuplicate,
  ...props
}: PropType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const questionRef = useRef<HTMLDivElement>(null);

  const defaultValues: Partial<z.infer<typeof parsedQuestionsSchema>> = {
    correct_answer: question?.correct_answer.map((answer) => ({
      value: answer,
    })),
    question: question?.question,
    options: question?.options.map((answer) => ({ value: answer })),
  };

  const form = useForm<z.infer<typeof parsedQuestionsSchema>>({
    resolver: zodResolver(parsedQuestionsSchema),
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const { fields, append } = useFieldArray({
    name: "options",
    control: form.control,
  });

  const { fields: answerFields, append: answerAppend } = useFieldArray({
    name: "correct_answer",
    control: form.control,
  });

  const onSubmit = async (data: z.infer<typeof parsedQuestionsSchema>) => {
    setError("");
    try {
      setLoading(true);
      const formattedData = {} as QuestionProps;
      // mapping these values because the data is changed during the form creation process when using useFieldArray hook for looping through the array
      formattedData.question = data.question;
      formattedData.correct_answer = data.correct_answer.map(
        (answer) => answer.value
      );
      formattedData.options = data.options.map((option) => option.value);

      const { success } = await db.parseQuestionRouter.updateParsedQuestion({
        parseQuestionId: question.id,
        data: formattedData,
      });
      if (success) {
        setLoading(false);
        setError("");
        setIsDirty(false);
        return;
      }
      setLoading(false);
      setError("Can't update Question");
    } catch (err) {
      setLoading(false);
      setError("Error updating Question");
      console.log(err);
    }
  };

  const onUnfocusedHandler = () => {
    const validData = parsedQuestionsSchema.safeParse(form.getValues());

    if (isDirty && validData) {
      onSubmit(form.getValues());
    }
  };

  const archiveQuestionHandler = async () => {
    const { success } = await db.parseQuestionRouter.archiveParsedQuestion({
      parsedQuestionId: question.id,
    });
    if (!success) {
      setError("Can't Delete Question Try Again later");
    }
  };

  const createDuplicateHandler = () => {
    createDuplicate({ data: question });
  };

  return (
    <div ref={questionRef}>
      <Form {...form}>
        <form onBlur={onUnfocusedHandler} className={cn("", props.className)}>
          <Question>
            {/* ---------------------------------- Questions -------------------------------------- */}
            <div className="flex w-full justify-between gap-5">
              <QuestionText questionNumber={questionNumber} className="w-full">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextareaAutosize
                          className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-lg w-full"
                          placeholder={!field.value ? "Add your Question" : ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </QuestionText>
              <div className="flex items-center gap-3 self-start">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <button
                        type="button"
                        onClick={archiveQuestionHandler}
                        className="cursor-pointer rounded-full bg-error h-fit p-2 text-error-content"
                      >
                        <LuTrash />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-600 text-black">
                      Delete Question
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger type="button">
                      <button
                        type="button"
                        onClick={createDuplicateHandler}
                        className="cursor-pointer rounded-full bg-accent h-fit p-2 text-accent-content"
                      >
                        <LuCopy />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-600 text-black">
                      Duplicate Question
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {error && (
                <p className="text-xs whitespace-nowrap font-medium text-red-400">
                  {error}
                </p>
              )}
            </div>
            {/* -------------------------------------- Options -------------------------------- */}
            {question.options.length > 0 && (
              <Options>
                {fields.map((option, index) => {
                  return (
                    <Option key={index}>
                      <FormField
                        control={form.control}
                        name={`options.${index}.value`}
                        render={({ field }) => {
                          return (
                            <>
                              <div className="pt-1 pb-2">
                                <FormItem>
                                  <FormControl>
                                    <TextareaAutosize
                                      className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-[16px]"
                                      placeholder={
                                        !option.value
                                          ? "Provide Options for your Question"
                                          : ""
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              </div>
                            </>
                          );
                        }}
                      />
                    </Option>
                  );
                })}
              </Options>
            )}
            {/* ----------------------------------------- Answers -------------------------------- */}
            {question.correct_answer.length > 0 && (
              <Answer>
                {answerFields.map((answer, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`correct_answer.${index}.value`}
                    render={({ field }) => {
                      return (
                        <>
                          <div className="pt-1 pb-2">
                            <FormItem>
                              <FormControl>
                                <TextareaAutosize
                                  className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0"
                                  placeholder={
                                    !answer.value
                                      ? "Provide Answers for your Question"
                                      : ""
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </>
                      );
                    }}
                  />
                ))}
              </Answer>
            )}
            {/* ---------------------------------------------------------------------------------------------------- */}
          </Question>
        </form>
      </Form>
    </div>
  );
};
