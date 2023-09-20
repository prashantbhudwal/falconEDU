"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { teacherPreferencesSchema } from "../../schema";
import { updateTeacherPreferences } from "../mutations";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

const defaultValues: z.infer<typeof teacherPreferencesSchema> = {
  personalInformation: "",
  professionalInformation: "",
  likes: "",
  dislikes: "",
};

const personalInfo = [
  {
    name: "personalInformation",
    label: "Personal Information",
    placeholder:
      "What are your hobbies? What are your favorite things to do? What kind of music do you like?",
    description: "AI will use this to form a connection with the students.",
  },
  {
    name: "professionalInformation",
    label: "Professional Information",
    placeholder:
      "Where have you studied? What are your qualifications? What are your professional interests? What about your professional experience?",
    description: "AI will use this to build credibility with the students.",
  },
  {
    name: "likes",
    label: "Likes",
    placeholder:
      "What are some things you like? What behaviors should be encouraged?",
    description: "AI will use this to form a connection with the students.",
  },
  {
    name: "dislikes",
    label: "Dislikes",
    placeholder:
      "What are some things you don't like? What behaviors do you not tolerate?",
    description: "AI will use this to form a connection with the students.",
  },
] as const;

type TeacherPreferencesFormProps = {
  teacherId: string;
  initialValues: z.infer<typeof teacherPreferencesSchema>;
};
export default function TeacherPreferencesForm({
  teacherId,
  initialValues,
}: TeacherPreferencesFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof teacherPreferencesSchema>>({
    resolver: zodResolver(teacherPreferencesSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof teacherPreferencesSchema>) => {
    setLoading(true);
    try {
      await updateTeacherPreferences(teacherId, values);
    } catch (error) {
      form.setError("personalInformation", {
        type: "manual",
        message: "Failed to update preferences.",
      });
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 md:mx-32  rounded-lg p-3 bg-purple-300 text-black"
      >
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl font-bold tracking-tight font-sans">
              My Preferences
            </h2>
            <p className="text-sm max-w-2xl">
              This includes information about you that stays common for all the
              bots. The more information you provide, the better the AI will be
              able to form a connection with the students.
            </p>
          </div>
          <Button type="submit" size={"lg"}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
        <Separator className="my-6" />
        {personalInfo.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <TextareaAutosize
                    placeholder={item.placeholder}
                    className="resize-none placeholder:text-xs min-h-[6rem]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>{item.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
