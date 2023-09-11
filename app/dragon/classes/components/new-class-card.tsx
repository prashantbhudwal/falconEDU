"use client";
import { FaPlus } from "react-icons/fa6";
import ClassCard from "./class-card";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { PreviewCard } from "../class/[classId]/bots/components/ui/preview-card";
import * as z from "zod";
import { createClassForTeacher } from "../actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  className: z.string().min(3).max(50),
});

export function NewClassCard() {
  const { data } = useSession();
  const teacherId = data?.user?.id ?? "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { className } = values;
    try {
      setLoading(true);
      await createClassForTeacher(className, teacherId);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ClassCard className="rounded-lg flex flex-row gap-2 w-full items-baseline">
          <FaPlus className="text-accent" />
          <div>New Class</div>
        </ClassCard>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Class</DialogTitle>
          <DialogDescription>
            Create a new class to manage your students and bots.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Grade 6 - Section B" {...field} />
                  </FormControl>
                  <FormDescription>Nickname for your class.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
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
