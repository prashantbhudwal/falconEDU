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
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-form";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/ui/chip";
import { botPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FiInfo } from "react-icons/fi";
import { FiBookOpen } from "react-icons/fi";
import { ClipboardIcon } from "@heroicons/react/24/solid";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { LanguageIcon } from "@heroicons/react/24/solid";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { Paper } from "@/components/ui/paper";
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
  const { toast } = useToast();
  const form = useForm<z.infer<typeof botPreferencesSchema>>({
    resolver: zodResolver(botPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });

  const [characterCount, setCharacterCount] = useState(0);

  const handleInputChange = (event: any) => {
    const newValue = event.target.value;
    setCharacterCount(newValue.length);
  };

  const onSubmit = async (data: z.infer<typeof botPreferencesSchema>) => {
    setLoading(true);
    const result = await updateBotConfig(classId, botId, data);
    setLoading(false);
    if (result.success) {
      console.log("Successfully updated.");
      toast({
        description: "saved successfully",
      });
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
          <Paper variant="gray" className="w-full max-w-5xl">
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
                    className={`mb-5 flex justify-between w-full align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    <div className="flex gap-2">
                      Instructions
                      <FiInfo />
                    </div>
                    <Badge variant="outline">{characterCount}</Badge>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Be polite with the students. Never use negative language."
                      className="resize-none h-60"
                      {...field}
                      onFocus={() => setInputFocus("instructions")}
                      onBlur={() => setInputFocus("")}
                      onInput={handleInputChange}
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
                      <AcademicCapIcon className="h-4 w-4" />
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
                      <FiBookOpen />
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
                    <ClipboardIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
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
                    <SpeakerWaveIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
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
                    <LightBulbIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
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
                    <LanguageIcon className="h-4 w-4" />
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={() => {
                        field.onChange;
                      }}
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
