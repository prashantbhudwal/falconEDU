"use client";
import React from "react";
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
import { OrgType } from "@prisma/client";
import { Button, Select, SelectItem, Text, TextInput } from "@tremor/react";
import { registerOrg } from "../mutations";

const orgTypes: ["SCHOOL", "TUTORIAL", "COLLEGE", "COMPANY", "OTHER"] = [
  "SCHOOL",
  "TUTORIAL",
  "COLLEGE",
  "COMPANY",
  "OTHER",
];

const orgRegisterFormSchema = z.object({
  name: z.string().min(1),
  type: z.enum(orgTypes), //TODO: fix with imported enums
});

const OrgRegisterForm = ({ userId }: { userId: string }) => {
  const form = useForm<z.infer<typeof orgRegisterFormSchema>>({
    resolver: zodResolver(orgRegisterFormSchema),
    defaultValues: {
      name: "",
      type: "SCHOOL",
    },
  });

  const onSubmit = async function (
    values: z.infer<typeof orgRegisterFormSchema>
  ) {
    const { name, type } = values;
    const result = await registerOrg({ name, type, userId });
    if (result) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <div className="w-full h-full flex justify-center items-center">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-center space-y-4"
        >
          <Text>Register Organization</Text>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="Organization Name"
                    className="w-72"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select {...field}>
                    {orgTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="min-w-[100px] rounded-xl">
            Save
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default OrgRegisterForm;
