"use client";
import { FaPlus } from "react-icons/fa6";
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
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ClassCard from "./class-card";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { db } from "../routers";

const formSchema = z.object({
  className: z.string().min(3).max(50),
});

export function NewClassCard() {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { className } = values;
    try {
      setLoading(true);
      await db.class.createClassForTeacher({ className, userId });
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
      <DialogTrigger asChild className="rounded-lg">
        <ClassCard
          icon={<FolderPlusIcon className="h-12 w-12 text-secondary" />}
          name="New Class"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px">
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
