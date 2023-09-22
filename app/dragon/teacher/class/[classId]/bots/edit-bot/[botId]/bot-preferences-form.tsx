"use client";
import { type BotConfig } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  updateBotConfig,
  unPublishBotConfig,
  publishBotConfig,
} from "../../../../../mutations";
import { fetchBotConfig } from "../../../../../queries";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { botPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  grades,
  board,
  languageProficiency,
  tone,
  humorLevel,
  subjects,
} from "../../../../../../schema";

const defaultValues: z.infer<typeof botPreferencesSchema> = {
  instructions: "How do you want bots to behave?",
  subjects: ["Grade 1"],
  grades: [],
  board: "CBSE",
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof botPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
};

export default function BotPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig,
}: BotPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof botPreferencesSchema>>({
    resolver: zodResolver(botPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof botPreferencesSchema>) => {
    console.log(data);
    setLoading(true);
    const result = await updateBotConfig(classId, botId, data);
    setLoading(false);
    if (result.success) {
      console.log("Successfully updated.");
      setError(null); // clear any existing error
    } else {
      console.log("Update failed:", result.error);
      setError("Failed to update bot config. Please try again."); // set the error message
    }
  };

  const onPublish = async () => {
    const result = await publishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };

  const onUnPublish = async () => {
    const result = await unPublishBotConfig(classId, botId);
    if (result.success) {
    } else {
      setError("Failed to publish bot config. Please try again."); // set the error message
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 m-10 lg:mx-32 rounded-sm p-10 shadow-inner hover:transition-all duration-300  shadow-slate-700"
        >
          <div className="flex justify-between flex-wrap">
            <h2 className="md:text-3xl font-bold tracking-wide">
              Bot Preference
            </h2>
            <div className="flex flex-row gap-2">
              <Button type="submit">{loading ? "Saving" : "Save"}</Button>
              <Button
                variant={botConfig?.published ? "destructive" : "secondary"}
                onClick={botConfig?.published ? onUnPublish : onPublish}
              >
                {botConfig?.published ? "Un-publish" : "Publish"}
              </Button>
            </div>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <Separator className="my-6" />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex gap-2 align-middle font-bold">
                  Instructions
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Be polite with the students. Never use negative language."
                    className="resize-none h-60"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  How do you want the bot to behave?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grades"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="flex gap-2 align-middle font-bold">
                    Grades
                  </FormLabel>
                  <FormDescription>
                    Which grades do you want the AI to teach?
                  </FormDescription>
                </div>
                <div className="flex flex-row gap-y-5 flex-wrap gap-x-6">
                  {grades.map((grade) => (
                    <FormField
                      key={grade}
                      control={form.control}
                      name="grades"
                      render={({ field }) => {
                        return (
                          <FormItem key={grade}>
                            <FormControl className="">
                              <Chip
                                checked={field.value?.includes(grade)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, grade])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== grade
                                        )
                                      );
                                }}
                                className="w-full mx-2 h-7 transition-all duration-200 hover:scale-[1.2] border-green-600 border-[1px]  rounded-lg    data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 text-sm"
                                toggleName={grade}
                              />
                            </FormControl>
                            {/* <FormLabel className="font-normal">{grade}</FormLabel> */}
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subjects"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Subjects</FormLabel>
                  <FormDescription>
                    Which subjects do you want the AI to teach?
                  </FormDescription>
                </div>
                <div className="flex flex-row gap-y-5 flex-wrap gap-x-6 ">
                  {subjects.map((subject) => (
                    <FormField
                      key={subject}
                      control={form.control}
                      name="subjects"
                      render={({ field }) => {
                        return (
                          <FormItem key={subject}>
                            <FormControl>
                              <Chip
                                checked={field.value?.includes(subject)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== subject
                                        )
                                      );
                                }}
                                className="w-full mx-2 h-7 transition-all duration-200 hover:scale-[1.2] border-green-600 border-[1px]  rounded-lg    data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 text-sm"
                                toggleName={subject}
                              />
                            </FormControl>
                            {/* <FormLabel className="font-normal">
                            {subject}
                          </FormLabel> */}
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="board"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex gap-2 align-middle font-bold">
                  Board
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {board.map((board) => (
                      <FormItem
                        className="flex flex-row items-center space-x-3 space-y-0"
                        key={board}
                      >
                        <FormControl>
                          <RadioGroupItem value={board} />
                        </FormControl>
                        <FormLabel className="font-normal">{board}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex gap-2 align-middle font-bold">
                  Tone
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {tone.map((tone) => (
                      <FormItem
                        className="flex flex-row items-center space-x-3 space-y-0"
                        key={tone}
                      >
                        <FormControl>
                          <RadioGroupItem value={tone} />
                        </FormControl>
                        <FormLabel className="font-normal">{tone}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Do you want your AI to be friendly or formal?
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="humorLevel"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex gap-2 align-middle font-bold">
                  Humor Level
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {humorLevel.map((humorLevel) => (
                      <FormItem
                        className="flex flex-row items-center space-x-3 space-y-0"
                        key={humorLevel}
                      >
                        <FormControl>
                          <RadioGroupItem value={humorLevel} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {humorLevel}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Do you want your AI to be stoic or funny?
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="languageProficiency"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex gap-2 align-middle font-bold">
                  Language Proficiency
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {languageProficiency.map((languageProficiency) => (
                      <FormItem
                        className="flex flex-row items-center space-x-3 space-y-0"
                        key={languageProficiency}
                      >
                        <FormControl>
                          <RadioGroupItem value={languageProficiency} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {languageProficiency}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  How comfortable are your students with English?
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
