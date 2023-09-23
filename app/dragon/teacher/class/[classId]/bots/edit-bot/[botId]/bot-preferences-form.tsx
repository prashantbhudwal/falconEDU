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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-form";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/ui/chip";
import { botPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HiMiniInformationCircle } from "react-icons/hi2";
import { IoBookSharp } from "react-icons/io5";
import { BsFillClipboardFill } from "react-icons/bs";
import { GiGraduateCap } from "react-icons/gi";
import { FaLanguage } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import { HiSpeakerWave } from "react-icons/hi2";
import { Paper } from "@/components/ui/Paper";

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
  const [inputFocus, setInputFocus] = useState("");

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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Paper variant="form">
            <div className="flex justify-between flex-wrap p-5">
              <h2 className="md:text-3xl font-bold tracking-wide">
                Bot Preference
              </h2>
              <div className="flex flex-row gap-6">
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
                  <FormLabel
                    className={`mb-5 flex gap-2 align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    Instructions
                    <HiMiniInformationCircle />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Be polite with the students. Never use negative language."
                      className="resize-none h-60"
                      {...field}
                      onFocus={() => setInputFocus("instructions")}
                      onBlur={() => setInputFocus("")}
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
                  <div className="mb-5 flex flex-col gap-2">
                    <FormLabel className="flex gap-2 items-center font-bold">
                      Grades
                      <GiGraduateCap size={18} />
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
                              <FormControl>
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
                                  className="font-medium min-w-[50px] w-full active:scale-90 mx-2 h-8 transition-all duration-200 hover:scale-[1.2] shadow-inner  border-0 shadow-slate-700 rounded-lg  data-[state=checked]:shadow-inherit   data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 text-sm "
                                  toggleName={grade}
                                />
                              </FormControl>
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
                  <div className="mb-5 flex flex-col gap-2">
                    <FormLabel className="flex gap-2 items-center font-bold">
                      Subjects
                      <IoBookSharp />
                    </FormLabel>
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
                                      ? field.onChange([
                                          ...field.value,
                                          subject,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== subject
                                          )
                                        );
                                  }}
                                  className="font-medium min-w-[50px] w-full mx-2 h-8 active:scale-90 transition-all duration-200 hover:scale-[1.2] shadow-inner  border-0 shadow-slate-700 rounded-lg  data-[state=checked]:shadow-inherit    data-[state=checked]:bg-primary data-[state=checked]:text-slate-800 text-sm"
                                  toggleName={subject}
                                />
                              </FormControl>
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
                  <FormLabel className="mb-5 flex gap-2 items-center font-bold">
                    Board
                    <BsFillClipboardFill size={12} />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {board.map((board) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={board}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={board}
                              className="border-none shadow-inner shadow-slate-600 active:scale-90 transition-all duration-200 hover:scale-[1.2]"
                            />
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
                  <FormLabel className="mb-5 flex gap-2 items-center font-bold">
                    Tone
                    <HiSpeakerWave />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {tone.map((tone) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={tone}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={tone}
                              className="border-none shadow-inner shadow-slate-600 active:scale-90 transition-all duration-200 hover:scale-[1.2]"
                            />
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
                  <FormLabel className="mb-5 flex gap-2 items-center font-bold">
                    Humor Level
                    <HiLightBulb size={19} />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {humorLevel.map((humorLevel) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={humorLevel}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={humorLevel}
                              className="border-none shadow-inner shadow-slate-600 active:scale-90 transition-all duration-200 hover:scale-[1.2]"
                            />
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
                  <FormLabel className="flex gap-2 items-center font-bold">
                    Language Proficiency
                    <FaLanguage size={19} />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1 space-x-6"
                    >
                      {languageProficiency.map((languageProficiency) => (
                        <FormItem
                          className="flex flex-row items-center space-x-3 space-y-0"
                          key={languageProficiency}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={languageProficiency}
                              className="border-none shadow-inner shadow-slate-600 active:scale-90 transition-all duration-200 hover:scale-[1.2]"
                            />
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
          </Paper>
        </form>
      </Form>
    </>
  );
}
