"use client";
import { createClassForTeacher } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { type } from "os";

const formSchema = z.object({
  className: z.string().min(3).max(50),
});

type NewClassFormProps = {
  setOpen: (open: boolean) => void;
};

export function NewClassForm({ setOpen }: NewClassFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
    },
  });
  const { data } = useSession();
  const teacherId = data?.user?.id ?? "";
  console.log(teacherId);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { className } = values;
    try {
      await createClassForTeacher(className, teacherId);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Grade 6 - Section A" {...field} />
              </FormControl>
              <FormDescription>Nickname for your class.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" onClick={() => setOpen(false)}>
          Create Class
        </Button>
      </form>
    </Form>
  );
}
