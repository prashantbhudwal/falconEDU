"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { teacherPreferencesSchema } from "../../schema";
import { updateTeacherPreferences } from "../mutations";
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
import { LIMITS_teacherPreferencesSchema } from "../../schema";
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Paper variant="gray" className="my-8">
          <div className="flex justify-between p-5 rounded-lg ">
            <div className=" flex flex-col gap-2">
              <h2 className="md:text-3xl font-bold tracking-wide">
                My Preferences
              </h2>
              <p
                className={` text-base max-w-lg hover:transition-all duration-300 ${
                  onHover ? "text-slate-400" : "text-slate-500"
                } `}
              >
                This includes information about you that stays common for all
                the bots. The more information you provide, the better the AI
                will be able to form a connection with the students.
              </p>
            </div>
            <div className="relative">
              <Button
                type="submit"
                onMouseEnter={handleDescriptionHoverEnter}
                onMouseLeave={handleDescriptionHoverLeave}
                disabled={!isDirty}
              >
                {loading ? "Saving" : isDirty ? "Save" : "Saved"}
              </Button>
              {isDirty && (
                <div className="text-sm font-semibold text-slate-500 absolute mt-2 right-0 whitespace-nowrap ">
                  Unsaved changes
                </div>
              )}
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
                    className={`mb-5 flex gap-2 items-center font-bold ${
                      inputFocus === item.name ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                    {getIconForFormLabel(item.iconName)}
                  </FormLabel>
                  <FormControl className="tracking-wider">
                    <Textarea
                      placeholder={item.placeholder}
                      className="resize-none  placeholder:text-xs font-semibold min-h-[6rem]"
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
        </Paper>
      </form>
    </Form>
  );
}
