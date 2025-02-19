"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "../../../../lib/routers";
import { Grade, Class } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trackEvent } from "@/lib/mixpanel";

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

type ClassFormTypes = Pick<Class, "section" | "grade">;

const formSchema = z.object({
  grade: z.nativeEnum(Grade),
  section: z.string().nullable(),
  hasSection: z.boolean(),
});

export function NewClass({ className }: { className?: string }) {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const email = data?.user?.email ?? "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { grade, section } = values;
    try {
      setLoading(true);
      const newClass = await db.class.createClassForTeacher({
        grade,
        section,
        userId,
      });
      const {
        id: newClassId,
        grade: newClassGrade,
        section: newClassSection,
      } = newClass;
      trackEvent("teacher", "class_created", {
        distinct_id: email,
        class_id: newClassId,
        grade: newClassGrade,
        section: newClassSection ?? undefined,
      });
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (open) {
      form.reset({
        grade: undefined,
        section: null,
        hasSection: false,
      });
    }
  }, [open, form.reset, form]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="rounded-lg">
        <Button variant={"outline"} size={"sm"} className={className}>
          <div className="flex items-center gap-1">
            <FaPlus className="h-3 w-3 text-inherit" />
            <div> New Class</div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px">
        <DialogHeader>
          <DialogTitle>New Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
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
            <FormField
              control={form.control}
              name="hasSection"
              render={({ field }) => (
                <FormItem className="my-0 flex flex-row items-center justify-between border p-2">
                  <FormLabel>Are there sections?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <AnimatePresence>
              {form.watch("hasSection") && (
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
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="loading loading-infinity loading-xs"></span>
              ) : (
                "Create Class"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
