"use client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
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

type QuestionProps = NonNullable<typeGetParsedQuestionByBotConfigId>[number];

type PropType = React.HTMLProps<HTMLDivElement> & {
  question: QuestionProps;
};

export const QuestionForm = ({ question, ...props }: PropType) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <>
      <Form {...form}>
        <form
          // onSubmit={form.handleSubmit(onSubmit)}
          className={cn("", props.className)}
        >
          <div className="mb-10 rounded-lg p-5 bg-base-200">
            {/* ---------------------------------- Questions -------------------------------------- */}
            <div className="flex gap-5 justify-between items-start">
              <div className="flex flex-col gap-1 pb-2 w-full">
                <span className="text-xs">
                  Question {question.question_number}:
                </span>
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextareaAutosize
                          className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-lg"
                          placeholder={!field.value ? "Add your Question" : ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Button
                  className="min-w-[100px] disabled:cursor-not-allowed"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!isDirty}
                >
                  {loading ? (
                    <span className="loading loading-infinity loading-sm"></span>
                  ) : (
                    <span>{isDirty ? "save" : "saved"}</span>
                  )}
                </Button>
                {error && (
                  <p className="text-xs whitespace-nowrap font-medium text-red-400">
                    {error}
                  </p>
                )}
              </div>
            </div>
            <Separator className="border-white" />
            {/* -------------------------------------- Options -------------------------------- */}
            {question.options.length > 0 && (
              <div className="mt-3">
                <span className="text-xs">Options:</span>
                {fields.map((option, index) => {
                  return (
                    <FormField
                      key={index}
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
                  );
                })}
              </div>
            )}
            <Separator className="border-white" />
            {/* ----------------------------------------- Answers -------------------------------- */}
            {question.correct_answer.length > 0 && (
              <div className="mt-3">
                <span className="text-xs">Answer:</span>
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
                                  className="bg-transparent min-h-fit resize-none overflow-y-auto whitespace-pre-line border-none outline-none focus-visible:ring-0 p-0 text-[16px]"
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
              </div>
            )}
            {/* ---------------------------------------------------------------------------------------------------- */}
          </div>
        </form>
      </Form>
    </>
  );
};
