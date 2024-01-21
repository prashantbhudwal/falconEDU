"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import { FolderPlusIcon } from "@heroicons/react/24/solid";

import { Grade } from "@prisma/client";
import { Class } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { db } from "@/app/dragon/teacher/routers";

type GradeOption = {
  label: string;
  value: Grade;
};
const gradeOptions: GradeOption[] = [
  { label: "Grade 3", value: "GRADE_3" },
  { label: "Grade 4", value: "GRADE_4" },
  { label: "Grade 5", value: "GRADE_5" },
  { label: "Grade 6", value: "GRADE_6" },
  { label: "Grade 7", value: "GRADE_7" },
  { label: "Grade 8", value: "GRADE_8" },
  { label: "Grade 9", value: "GRADE_9" },
  { label: "Grade 10", value: "GRADE_10" },
];

const formSchema = z.object({
  grade: z.nativeEnum(Grade),
  section: z.string().nullable(),
});

export function ClassPreferencesForm({
  initialValues,
}: {
  initialValues: Class;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: initialValues.grade || null,
      section: initialValues.section || null,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { grade, section } = values;
    try {
      setLoading(true);
      const updatedClass = await db.class.updateClassForTeacher({
        grade,
        section,
        classId: initialValues.id,
      });

      form.setValue("grade", updatedClass.grade);
      form.setValue("section", updatedClass.section);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-8"
      >
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                required
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AnimatePresence>
          (
          <motion.div
            key="sectionField"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""} // Display an empty string if field.value is null or undefined
                      placeholder="Enter Section Name"
                      onChange={(e) => {
                        // Update the form state to null if the input is empty, otherwise use the input value
                        field.onChange(
                          e.target.value === "" ? null : e.target.value,
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          )
        </AnimatePresence>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="">
            {loading ? (
              <span className="loading loading-infinity loading-xs"></span>
            ) : (
              "Update Class"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
