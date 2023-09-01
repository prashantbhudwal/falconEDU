"use client";
import { Paper } from "@/components/ui/paper";
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

const personalInfoSchema = z.object({
  professionalInformation: z.string().min(50).max(500).optional(),
  personalInformation: z.string().min(50).max(500).optional(),
  likes: z.string().min(50).max(500).optional(),
  dislikes: z.string().min(50).max(500).optional(),
});

const defaultValues: z.infer<typeof personalInfoSchema> = {
  personalInformation: "",
  professionalInformation: "",
  likes: "",
  dislikes: "",
};

const onSubmit = (values: z.infer<typeof personalInfoSchema>) => {
  console.log(values);
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

export default function PersonalInfo() {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  return (
    <Paper className="flex-1 h-full min-h-screen w-4/6 mx-auto my-2">
      <h2 className="text-2xl font-bold tracking-tight">Teacher Preferences</h2>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Mapping over all text boxes */}
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
          <Button type="submit">Update profile</Button>
        </form>
      </Form>
    </Paper>
  );
}
