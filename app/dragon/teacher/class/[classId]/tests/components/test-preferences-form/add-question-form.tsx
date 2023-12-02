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
import React, { useState } from "react";
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
import { ZodType, z } from "zod";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { LuCopy, LuX } from "react-icons/lu";
import { LuTrash } from "react-icons/lu";
import { db } from "@/app/dragon/teacher/routers";
import { typeGetParsedQuestionByBotConfigId } from "@/app/dragon/teacher/routers/parsedQuestionRouter";
import { saveParsedQuestions } from "@/app/dragon/teacher/mutations";
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
  deleteQuestions: ({ id }: { id: string }) => void;
  createDuplicate: ({
    data,
  }: {
    data: Partial<z.infer<typeof parsedQuestionsSchema>>;
  }) => void;
  botConfigId: string;
  classId: string;
};

export const AddQuestionForm = ({
  question,
  questionNumber,
  deleteQuestions,
  botConfigId,
  classId,
  createDuplicate,
  ...props
}: PropType) => {
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

  const options = form.getValues().options;

  // -------------------------------------------Adding new Fields----------------------------------------------------
  const addFieldsHandler = ({
    field,
  }: {
    field: "options" | "correct_answer";
  }) => {
    form.setValue(field, [...form.getValues()[field], { value: "" }]);
  };

  // -------------------------------------------Removing existing fields----------------------------------------------------
  const removeFieldsHandler = ({
    field,
    index: removefieldIndex,
  }: {
    field: "options" | "correct_answer";
    index: number;
  }) => {
    const filteredFields = form
      .getValues()
      [field].filter((_, index) => index !== removefieldIndex);
    form.setValue(field, filteredFields);
  };

  const { fields, append } = useFieldArray({
    name: "options",
    control: form.control,
  });

  const { fields: answerFields, append: answerAppend } = useFieldArray({
    name: "correct_answer",
    control: form.control,
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  // -------------------------------------------On saving the Questions----------------------------------------------------
  const onSubmit = async (data: z.infer<typeof parsedQuestionsSchema>) => {
    if (data.correct_answer?.length === 0) {
      setError("Answer Cannot be Empty");
      return;
    }
    if (data.options?.length === 0) {
      setError("Options Cannot be Empty");
      return;
    }
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
      formattedData.question_number = questionNumber;

      const { success } = await saveParsedQuestions({
        parsedQuestions: [formattedData],
        botId: botConfigId,
        classId: classId,
      });

      if (success) {
        setLoading(false);
        setError("");
        setIsDirty(false);
        deleteQuestions({ id: question.id });
        return;
      }
      setLoading(false);
      setError("Can't Saving Question");
    } catch (err) {
      setLoading(false);
      setError("Error Saving Question");
      console.log(err);
    }
  };

  const onUnfocusedHandler = () => {};

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onBlur={onUnfocusedHandler}
          className={cn("", props.className)}
        >
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
                        onClick={() => deleteQuestions({ id: question.id })}
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
                        onClick={() =>
                          createDuplicate({ data: form.getValues() })
                        }
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

                <Button
                  disabled={!isDirty || loading}
                  className="cursor-pointer min-w-[90px] disabled:brightness-75 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
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
            <div className="relative">
              {options.length > 0 && (
                <Options>
                  {fields.map((option, index) => {
                    return (
                      <Option
                        key={option.id}
                        className="flex items-center justify-between gap-5 "
                      >
                        <FormField
                          control={form.control}
                          name={`options.${index}.value`}
                          render={({ field }) => {
                            return (
                              <div className="pt-1 pb-2 w-full">
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
                            );
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeFieldsHandler({ field: "options", index })
                          }
                        >
                          <LuX className="h-6 w-6 p-1 rounded-full bg-base-300" />
                        </button>
                      </Option>
                    );
                  })}
                </Options>
              )}
              <Button
                type="button"
                onClick={() => addFieldsHandler({ field: "options" })}
                variant={"default"}
              >
                Add Option
              </Button>
            </div>
            {/* ----------------------------------------- Answers -------------------------------- */}
            <Answer>
              {answerFields.map((answer, index) => (
                <div
                  className="flex gap-5 justify-between items-center"
                  key={answer.id}
                >
                  <FormField
                    control={form.control}
                    name={`correct_answer.${index}.value`}
                    render={({ field }) => {
                      return (
                        <div className="pt-1 w-full pb-2">
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
                      );
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeFieldsHandler({ field: "correct_answer", index })
                    }
                  >
                    <LuX className="h-6 w-6 p-1 rounded-full bg-base-300" />
                  </button>
                </div>
              ))}
            </Answer>
            <Button
              type="button"
              onClick={() => addFieldsHandler({ field: "correct_answer" })}
              variant={"default"}
            >
              Add Answer
            </Button>
            {/* ---------------------------------------------------------------------------------------------------- */}
          </Question>
        </form>
      </Form>
    </>
  );
};
