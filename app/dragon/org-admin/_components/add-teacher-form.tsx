"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { addStudentToClass } from "./mutations";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, Flex, TextInput } from "@tremor/react";
import { addTeacherToOrg } from "../mutations";

const addTeacherFormSchema = z.object({
  email: z.string().email().nonempty(),
});

export default function AddTeacherForm() {
  const form = useForm<z.infer<typeof addTeacherFormSchema>>({
    resolver: zodResolver(addTeacherFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (
    values: z.infer<typeof addTeacherFormSchema>
  ) {
    const { email } = values;
    const addedTeacher = await addTeacherToOrg({ email });

    if (!addedTeacher) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      return;
    }

    if (!addedTeacher?.found) {
      form.setError("email", {
        type: "manual",
        message: "Teacher is not on FalconAI. Ask them to sign up!",
      });
      return;
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="text-center">
        <Flex className="gap-3" alignItems="center" justifyContent="start">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    type="email"
                    placeholder="Enter Teacher email."
                    className="max-w-72 w-52"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="rounded-xl">
            Add to Org
          </Button>
        </Flex>
      </form>
    </Form>
  );
}
