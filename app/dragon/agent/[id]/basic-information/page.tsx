"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { agentSchema } from "@/app/dragon/agentSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectSeparator,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { grades, board } from "@/app/dragon/agentSchema";

const basicAgentInfoSchema = agentSchema.pick({
  instructions: true,
  teacherIntro: true,
  subjects: true,
  grades: true,
  board: true,
});

const defaultValues: z.infer<typeof basicAgentInfoSchema> = {
  instructions: "",
  teacherIntro: "",
  subjects: [],
  grades: [],
  board: "CBSE",
};

export interface AgentPageProps {
  params: {
    id: string;
  };
}
const onSubmit = (data: z.infer<typeof basicAgentInfoSchema>) => {
  console.log(data);
};

export default function AgentPage({ params }: AgentPageProps) {
  console.log(params);
  const form = useForm<z.infer<typeof basicAgentInfoSchema>>({
    resolver: zodResolver(basicAgentInfoSchema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Be polite with the students. Never use negative language."
                  className="resize-none"
                  {...field}
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
              <div className="mb-4">
                <FormLabel>Grades</FormLabel>
                <FormDescription>
                  Which grades do you want the AI to teach?
                </FormDescription>
              </div>
              {grades.map((grade) => (
                <FormField
                  key={grade}
                  control={form.control}
                  name="grades"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={grade}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
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
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{grade}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="board"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value[0]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose the board." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The curriculum you want the AI to follow.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
