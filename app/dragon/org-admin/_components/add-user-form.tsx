"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Flex, TextInput } from "@tremor/react";
import { db } from "@/lib/routers";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { set } from "date-fns";

const addUserFormSchema = z.object({
  email: z.string().email().nonempty(),
});

const AddUserForm = ({
  form,
  onSubmit,
  loading,
}: {
  form: any;
  onSubmit: any;
  loading: any;
}) => {
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
                    className="w-52 max-w-72"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{loading ? "Adding..." : "Add to Org"}</Button>
        </Flex>
      </form>
    </Form>
  );
};

export const AddTeacherForm = function ({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof addUserFormSchema>) {
    const { email } = values;

    setLoading(true);
    const addedTeacher = await db.org.addTeacherToOrg({
      orgId,
      email,
    });

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
    setLoading(false);
  };

  return <AddUserForm form={form} onSubmit={onSubmit} loading={loading} />;
};

export const AddStudentForm = function ({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof addUserFormSchema>) {
    const { email } = values;

    setLoading(true);
    const addedStudent = await db.org.addStudentToOrg({
      orgId,
      email,
    });

    if (!addedStudent) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      return;
    }

    if (!addedStudent?.found) {
      form.setError("email", {
        type: "manual",
        message: "Student is not on FalconAI. Ask them to sign up!",
      });
      return;
    }

    form.reset();
    setLoading(false);
  };

  return <AddUserForm form={form} onSubmit={onSubmit} loading={loading} />;
};

export const AddOrgAdminForm = function ({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof addUserFormSchema>>({
    resolver: zodResolver(addUserFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof addUserFormSchema>) {
    const { email } = values;

    setLoading(true);
    const addedAdmin = await db.org.addOrgAdminToOrg({
      orgId,
      email,
    });

    if (!addedAdmin) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      return;
    }

    if (!addedAdmin?.found) {
      form.setError("email", {
        type: "manual",
        message: "Admin is not on FalconAI. Ask them to sign up!",
      });
      return;
    }

    form.reset();
    setLoading(false);
  };

  return <AddUserForm form={form} onSubmit={onSubmit} loading={loading} />;
};
