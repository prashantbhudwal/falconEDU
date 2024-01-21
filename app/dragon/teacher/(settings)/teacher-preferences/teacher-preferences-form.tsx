"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { teacherPreferencesSchema } from "../../../schema";
import { updateTeacherPreferences } from "../../mutations";
import { FiThumbsDown } from "react-icons/fi";
import { FiThumbsUp } from "react-icons/fi";
import { FiInfo } from "react-icons/fi";

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
import { Paper } from "@/components/ui/paper";
import { LIMITS_teacherPreferencesSchema } from "../../../schema";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";

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
    iconName: "FiInfo",
  },
  {
    name: "professionalInformation",
    label: "Professional Information",
    placeholder:
      "Where have you studied? What are your qualifications? What are your professional interests? What about your professional experience?",
    description: "AI will use this to build credibility with the students.",
    iconName: "FiInfo",
  },
  {
    name: "likes",
    label: "Likes",
    placeholder:
      "What are some things you like? What behaviors should be encouraged?",
    description: "AI will use this to form a connection with the students.",
    iconName: "FiThumbsUp",
  },
  {
    name: "dislikes",
    label: "Dislikes",
    placeholder:
      "What are some things you don't like? What behaviors do you not tolerate?",
    description: "AI will use this to form a connection with the students.",
    iconName: "FiThumbsDown",
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
  const [inputFocus, setInputFocus] = useState("");
  const [onHover, setOnHover] = useState(false);

  const form = useForm<z.infer<typeof teacherPreferencesSchema>>({
    resolver: zodResolver(teacherPreferencesSchema),
    defaultValues: initialValues ?? defaultValues,
    mode: "onChange",
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (values: z.infer<typeof teacherPreferencesSchema>) => {
    setLoading(true);
    try {
      await updateTeacherPreferences(teacherId, values);
      setIsDirty(false);
    } catch (error) {
      form.setError("personalInformation", {
        type: "manual",
        message: "Failed to update preferences.",
      });
    }
    setLoading(false);
  };

  const getIconForFormLabel = (item: String) => {
    switch (item) {
      case "FiInfo":
        return <FiInfo size={14} />;
      case "FiThumbsUp":
        return <FiThumbsUp size={14} />;
      case "FiThumbsDown":
        return <FiThumbsDown size={14} />;
      default:
        return null;
    }
  };

  const handleDescriptionHoverEnter = () => {
    setOnHover(true);
  };

  const handleDescriptionHoverLeave = () => {
    setOnHover(false);
  };

  return (
    <Paper variant="gray" className="my-8 bg-base-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between rounded-lg p-5 ">
            <div className=" flex flex-col gap-2">
              <h2 className="font-bold tracking-wide text-slate-200 md:text-3xl">
                My Avatar
              </h2>

              <p
                className={` max-w-lg text-base duration-300 hover:transition-all ${
                  onHover ? "text-slate-400" : "text-slate-400"
                } `}
              >
                Your avatar that will represent you in the classroom. The more
                information you provide, the more your avatar will be able to
                connect with your students.
              </p>
            </div>
            <div className="w-36">
              <Button
                type="submit"
                onMouseEnter={handleDescriptionHoverEnter}
                onMouseLeave={handleDescriptionHoverLeave}
                disabled={!isDirty}
                className="w-full"
              >
                {loading ? "Saving" : isDirty ? "Save" : "Saved"}
              </Button>
              <div className="flex flex-col space-y-2">
                {isDirty && (
                  <div className="mt-2 whitespace-nowrap text-sm  font-semibold text-slate-500 ">
                    Unsaved changes
                  </div>
                )}
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="my-2 text-sm font-semibold text-destructive">
                    Check all fields
                  </div>
                )}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          {personalInfo.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={`mb-5 flex items-center gap-2 font-bold ${
                      inputFocus === item.name ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                    {getIconForFormLabel(item.iconName)}
                  </FormLabel>
                  <FormControl className="tracking-wider">
                    <Textarea
                      placeholder={item.placeholder}
                      className="min-h-[6rem]  resize-none font-semibold placeholder:text-xs"
                      {...field}
                      onFocus={() => setInputFocus(item.name)}
                      onBlur={() => setInputFocus("")}
                      hasCounter
                      maxChars={
                        LIMITS_teacherPreferencesSchema[item.name].maxLength
                      }
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
    </Paper>
  );
}
