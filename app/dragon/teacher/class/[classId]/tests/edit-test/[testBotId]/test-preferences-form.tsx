"use client";
import { type BotConfig } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  unPublishBotConfig,
  publishBotConfig,
  updateTestBotConfig,
} from "../../../../../mutations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { testBotPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { FiInfo } from "react-icons/fi";
import { Paper } from "@/components/ui/paper";
import { LIMITS_testBotPreferencesSchema } from "../../../../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";

const defaultValues: z.infer<typeof testBotPreferencesSchema> = {
  fullTest: "Enter the full test here",
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof testBotPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
};

export default function TestPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig,
}: BotPreferencesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputFocus, setInputFocus] = useState("");
  const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
  const isEmpty = preferences === null || preferences === undefined;

  const form = useForm<z.infer<typeof testBotPreferencesSchema>>({
    resolver: zodResolver(testBotPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    setLoading(true);
    const result = await updateTestBotConfig(classId, botId, data);
    setLoading(false);
    if (result.success) {
      setError(null); // clear any existing error
      setIsDirty(false);
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
          <Paper variant="gray" className="w-full max-w-5xl min-h-screen">
            <div className="flex justify-between flex-wrap p-5">
              <h2 className="md:text-3xl font-bold tracking-wide">
                {botConfig?.name || "Bot Preference"}
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-6">
                  <Button
                    type="submit"
                    disabled={(isEmpty && !isDirty) || !isDirty}
                  >
                    {loading ? "Saving" : isDirty ? "Save" : "Saved"}
                  </Button>
                  <Button
                    variant={botConfig?.published ? "destructive" : "secondary"}
                    onClick={botConfig?.published ? onUnPublish : onPublish}
                  >
                    {botConfig?.published ? "Un-publish" : "Publish"}
                  </Button>
                </div>
                {isDirty && (
                  <div className="text-sm text-slate-500">
                    You have unsaved changes.
                  </div>
                )}
              </div>
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Separator className="my-6" />
            <FormField
              control={form.control}
              name="fullTest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex gap-2 align-middle font-bold ${
                      inputFocus === "instructions" ? "text-white" : ""
                    }`}
                  >
                    Instructions
                    <FiInfo />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your test here."
                      className="resize-none h-96"
                      {...field}
                      onFocus={() => setInputFocus("instructions")}
                      onBlur={() => setInputFocus("")}
                      hasCounter
                      maxChars={MAX_CHARS}
                    />
                  </FormControl>
                  <FormDescription>
                    The bot will conduct the test for you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Paper>
        </form>
      </Form>
    </>
  );
}
