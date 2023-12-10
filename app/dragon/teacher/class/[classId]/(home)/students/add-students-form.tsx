"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStudentToClass } from "./mutations";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addStudentFormSchema = z.object({
  email: z.string().email().nonempty(),
});

type AddStudentFormProps = {
  classId: string;
};

export default function AddStudentForm({ classId }: AddStudentFormProps) {
  const form = useForm<z.infer<typeof addStudentFormSchema>>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (
    values: z.infer<typeof addStudentFormSchema>
  ) {
    let  { email } = values;
    email = email.replace(/^www\./, "");
    const result = await addStudentToClass(email, classId);
    if (result.notFound) {
      form.setError("email", {
        type: "manual",
        message: "Student not on FalconAI. Ask them to sign up!",
      });
    } else if (result.error) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } else if (result.success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter student email."
                  className="w-72"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add to class</Button>
      </form>
    </Form>
  );
}
