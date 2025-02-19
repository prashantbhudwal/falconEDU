"use client";
import {
  Question,
  QuestionText,
  Answer,
  Options,
  Option,
} from "../question/question";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { db } from "@/lib/routers";
import { typeActiveParsedQuestionByBotConfigId } from "@/lib/routers/parsedQuestionRouter";
import { LuCopy, LuTrash } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionTypes } from "@/app/dragon/ai/test-checker/tool";
import { getQuestionTypeName } from "../../../../../../../../../../lib/helpers";
import { parsedQuestionsSchema } from "@/lib/schema";
import { UpdatedQuestionType } from "@/types";

type QuestionProps = typeActiveParsedQuestionByBotConfigId;

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
    question_type: question?.question_type as UpdatedQuestionType,
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
        (answer) => answer.value,
      );
      formattedData.options = data.options.map((option) => option.value);
      formattedData.question_type =
        data.question_type || "OBJECTIVE_MULTIPLE_CHOICE_SINGLE_ANSWER";

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
            <div className="">
              <div className="flex w-full items-center justify-between pb-2 text-slate-500">
                <FormField
                  control={form.control}
                  name="question_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} {...field}>
                          <SelectTrigger className="w-fit border-none pl-0 ring-0 focus:ring-0">
                            <SelectValue placeholder={question.question_type} />
                          </SelectTrigger>
                          <SelectContent>
                            {questionTypes.map((question, index) => {
                              return (
                                <SelectItem key={index} value={question}>
                                  {getQuestionTypeName(question)}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-1 self-start">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <button
                          type="button"
                          onClick={archiveQuestionHandler}
                          className="h-fit cursor-pointer rounded-full p-2 text-slate-500 hover:bg-base-100 hover:text-base-content hover:shadow-sm hover:shadow-slate-700"
                        >
                          <LuTrash />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-600 text-slate-100">
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
                          className="h-fit cursor-pointer rounded-full p-2 text-slate-500 hover:bg-base-100 hover:text-base-content hover:shadow-sm hover:shadow-slate-700"
                        >
                          <LuCopy />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-600 text-slate-100">
                        Duplicate Question
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <QuestionText questionNumber={questionNumber} className="w-full">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextareaAutosize
                          className="min-h-fit w-full resize-none overflow-y-auto whitespace-pre-line border-none bg-transparent p-0 outline-none focus-visible:ring-0"
                          placeholder={!field.value ? "Add your Question" : ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </QuestionText>
            </div>
            <div className="flex flex-col items-end gap-1">
              {error && (
                <p className="whitespace-nowrap text-xs font-medium text-red-400">
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
                              <div className="pb-2 pt-1">
                                <FormItem>
                                  <FormControl>
                                    <TextareaAutosize
                                      className="min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none bg-transparent p-0 text-sm outline-none focus-visible:ring-0"
                                      placeholder={
                                        !option.value
                                          ? `Option ${index + 1}`
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
              <Answer question={question}>
                {answerFields.map((answer, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`correct_answer.${index}.value`}
                    render={({ field }) => {
                      return (
                        <>
                          <div className="pb-2 pt-1">
                            <FormItem>
                              <FormControl>
                                <TextareaAutosize
                                  className="min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none bg-transparent p-0 outline-none focus-visible:ring-0"
                                  placeholder={!answer.value ? "Answer" : ""}
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
