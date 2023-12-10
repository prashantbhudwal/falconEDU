"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PlusIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { db } from "@/app/dragon/teacher/routers";
import { useCreateNewConfig } from "@/app/dragon/teacher/hooks/use-create-config";

export function NewTaskModal({
  classId,
  userId,
}: {
  classId: string;
  userId: string;
}) {
  const createNewConfig = useCreateNewConfig();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const types = ["chat", "test"];

  const formSchema = z.object({
    taskName: z.string().min(3).max(50),
    type: z.string(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { taskName, type } = values;
    if (type === "chat" || type === "test") {
      try {
        setLoading(true);
        await createNewConfig({
          classId,
          userId,
          name: taskName,
          configType: type,
        });
        setLoading(false);
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
    },
  });

  return (
    <Dialog modal={true} open={open} onOpenChange={() => setOpen(!open)}>
      <DialogOverlay />
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"sm"}
          className="flex items-center justify-end gap-3"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="w-5 h-5" />
          <div>New Task</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium pb-5">
            New Task
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type of Task" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="hover:bg-slate-600 hover:cursor-pointer"
                        >
                          {type === "test" ? "Test" : "Bot"}
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
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="loading loading-infinity loading-xs"></span>
              ) : (
                "Create Task"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
