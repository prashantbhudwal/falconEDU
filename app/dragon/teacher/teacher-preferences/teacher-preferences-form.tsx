"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { teacherPreferencesSchema } from "../../schema";
import { updateTeacherPreferences } from "../mutations";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { HiMiniInformationCircle } from "react-icons/hi2";

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
    icons: "HiMiniInformationCircle",
  },
  {
    name: "professionalInformation",
    label: "Professional Information",
    placeholder:
      "Where have you studied? What are your qualifications? What are your professional interests? What about your professional experience?",
    description: "AI will use this to build credibility with the students.",
    icons: "HiMiniInformationCircle",
  },
  {
    name: "likes",
    label: "Likes",
    placeholder:
      "What are some things you like? What behaviors should be encouraged?",
    description: "AI will use this to form a connection with the students.",
    icons: "BsFillHandThumbsUpFill",
  },
  {
    name: "dislikes",
    label: "Dislikes",
    placeholder:
      "What are some things you don't like? What behaviors do you not tolerate?",
    description: "AI will use this to form a connection with the students.",
    icons: "BsFillHandThumbsDownFill",
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
  const [onHover, setonHover] = useState(false);

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

  const getIconForItem = (item: String) => {
    switch (item) {
      case "HiMiniInformationCircle":
        return <HiMiniInformationCircle size={14} />;
      case "BsFillHandThumbsUpFill":
        return <BsFillHandThumbsUpFill size={14} />;
      case "BsFillHandThumbsDownFill":
        return <BsFillHandThumbsDownFill size={14} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 m-10 lg:mx-32 rounded-xl p-10 shadow-inner  hover:transition-all duration-300  shadow-slate-500"
      >
        <div className="flex justify-between p-5 rounded-lg ">
          <div className="flex flex-col gap-2">
            <h2 className="md:text-3xl font-bold tracking-wide">
              My Preferences
            </h2>
            <p
              className={` text-base max-w-2xl hover:transition-all duration-300 ${
                onHover ? "text-slate-400" : "text-slate-500"
              } `}
            >
              This includes information about you that stays common for all the
              bots. The more information you provide, the better the AI will be
              able to form a connection with the students.
            </p>
          </div>
          <Button
            type="submit"
            onMouseEnter={() => {
              setonHover(true);
            }}
            onMouseLeave={() => {
              setonHover(false);
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
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
                  className={`flex gap-2 align-middle font-bold ${
                    inputFocus === item.name ? "text-white" : ""
                  }`}
                >
                  {item.label}
                  {getIconForItem(item.icons)}
                </FormLabel>
                <FormControl className="tracking-wider">
                  <TextareaAutosize
                    placeholder={item.placeholder}
                    className="resize-none  placeholder:text-xs font-semibold min-h-[6rem]"
                    {...field}
                    onFocus={() => setInputFocus(item.name)}
                    onBlur={() => setInputFocus("")}
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
