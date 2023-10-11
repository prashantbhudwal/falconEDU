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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-form";
import { Separator } from "@/components/ui/separator";
import { Chip } from "@/components/ui/chip";
import { testBotPreferencesSchema } from "../../../../../../schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FiInfo } from "react-icons/fi";
import { Paper } from "@/components/ui/paper";

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

  const form = useForm<z.infer<typeof testBotPreferencesSchema>>({
    resolver: zodResolver(testBotPreferencesSchema),
    defaultValues: preferences || defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof testBotPreferencesSchema>) => {
    setLoading(true);
    const result = await updateTestBotConfig(classId, botId, data);
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
          <Paper variant="gray">
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
                      className="resize-none h-60"
                      {...field}
                      onFocus={() => setInputFocus("instructions")}
                      onBlur={() => setInputFocus("")}
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
