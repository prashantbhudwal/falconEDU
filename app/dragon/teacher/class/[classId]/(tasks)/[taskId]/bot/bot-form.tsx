"use client";
import { HostedImage, type BotConfig } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/routers";
import { Form } from "@/components/ui/form";
import { Paper } from "@/components/ui/paper";
import { Grade } from "@prisma/client";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { Input } from "@/components/ui/input";
import endent from "endent";
import { HumorLevelField } from "../../components/task-form/fields/humor-level";
import { SaveButton } from "../../components/task-form/save-btn";
import {
  LIMITS_botPreferencesSchema,
  botNameSchema,
  botPreferencesSchema,
} from "@/lib/schema";
import { MediumOfInstructionField } from "../../components/task-form";
import { EquationsField } from "../../components/task-form/fields/equations";
import { TextAreaField } from "../../components/task-form/fields/magic-content/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotImage } from "../../components/image-upload/bot-image";
import { TaskType } from "@/types";

const MAX_CHARS = LIMITS_botPreferencesSchema.instructions.maxLength;

const defaultValues: z.infer<typeof botPreferencesSchema> = {
  instructions: "",
  tone: "Friendly",
  language: "English",
  humorLevel: "Moderate",
  languageProficiency: "Beginner",
  mediumOfInstruction: "english",
  hasEquations: false,
};

type BotPreferencesFormProps = {
  preferences?: z.infer<typeof botPreferencesSchema> | null;
  classId: string;
  botId: string;
  botConfig: BotConfig | null;
  grade: Grade;
  avatar: HostedImage | null;
};

export default function BotPreferencesForm({
  preferences,
  classId,
  botId,
  botConfig,
  grade,
  avatar,
}: BotPreferencesFormProps) {
  const taskType: TaskType = "chat";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botName, setBotName] = useState<string | undefined>(botConfig?.name);
  const [botDescription, setBotDescription] = useState<string | undefined>(
    botConfig?.description ?? "",
  );

  const form = useForm<z.infer<typeof botPreferencesSchema>>({
    resolver: zodResolver(botPreferencesSchema),
    defaultValues: preferences ?? defaultValues,
  });
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  const isEmpty = preferences === null || preferences === undefined;

  //log the form values

  const onSubmit = async (data: z.infer<typeof botPreferencesSchema>) => {
    setLoading(true);
    const result = await db.botConfig.updateBotConfig({
      classId,
      botId,
      data,
      configType: taskType,
    });
    setLoading(false);
    if (result.success) {
      setIsDirty(false);
      setError(null); // clear any existing error
    } else {
      console.error("Update failed:", result.error);
      setError("Failed to update bot config. Please try again."); // set the error message
    }
  };

  const updateBotNameHandler = async () => {
    const isValidName = botNameSchema.safeParse({ name: botName });
    if (!isValidName.success) {
      setError(
        "Failed to update , Bot names should be between 3 and 30 characters in length.",
      ); // set the error message
      setBotName(botConfig?.name);
      return;
    }
    const result = await db.botConfig.updateBotConfigName({
      classId,
      botId,
      name: botName || "Bot Preferences",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again."); // set the error message
    }
  };

  const onBotNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBotName(e.target.value);
    const isValidName = botNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Should be within 3-30 character limit."); // set the error message
      return;
    }
    setError("");
  };

  const onBotDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBotDescription(e.target.value);
    const isValid = botDescription && botDescription?.length < 50;
    if (!isValid) {
      setError("Description should be within 50 characters.");
      return;
    }
    setError("");
  };

  const updateBotDescriptionHandler = async () => {
    const result = await db.botConfig.updateBotConfigDescription({
      classId,
      botId,
      description: botDescription || "",
    });
    if (result.success) {
      setError("");
    } else {
      setError("Failed to update bot name. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Paper
          variant="gray"
          className="min-h-screen w-full max-w-5xl space-y-8 border-none bg-base-200 pt-12 shadow-none"
        >
          <BotImage
            taskId={botId}
            taskName={botName || "Unnamed Bot"}
            classId={classId}
            type={taskType}
            avatar={avatar}
          />
          <div className="flex min-h-14 flex-wrap justify-between">
            <div className="flex w-[50%] flex-col space-y-2">
              <Input
                type="text"
                value={botName}
                onChange={onBotNameChange}
                onBlur={updateBotNameHandler}
                className="border-none pl-0 text-xl font-bold tracking-wide outline-none focus-visible:ring-0  "
              />

              {error && (
                <div className="mt-3 text-xs text-red-500">{error}</div>
              )}
            </div>
            <SaveButton
              isLoading={loading}
              isDisabled={(isEmpty && !isDirty) || !isDirty}
              hasUnsavedChanges={isDirty}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={botDescription}
                onChange={onBotDescriptionChange}
                onBlur={updateBotDescriptionHandler}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <TextAreaField
                name="instructions"
                placeholder={endent`
                Your name is Sporty, the sports teacher. You make students excited about sports. 
                
                - Be polite with the students. 
                - Never use negative language.
                - Use positive reinforcement.
                 `}
                maxChars={MAX_CHARS}
              />
            </CardContent>
          </Card>
          <EquationsField name="hasEquations" />
          <div className="grid grid-cols-6 gap-2">
            <MediumOfInstructionField
              name="mediumOfInstruction"
              className="col-span-3 col-start-1"
            />
            <HumorLevelField
              name="humorLevel"
              className="col-span-3 col-start-4"
            />
          </div>
        </Paper>
      </form>
    </Form>
  );
}
