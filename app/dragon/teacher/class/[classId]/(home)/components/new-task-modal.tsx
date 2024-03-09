"use client";
import { newTaskModalAtom } from "@/lib/atoms/ui";
import { useAtom } from "jotai";
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
import { useCreateNewConfig } from "@/app/dragon/teacher/hooks/use-create-config";
import { getTaskProperties } from "@/lib/helpers";
import { TaskType } from "@/types/dragon";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group-form";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Label } from "@/components/ui/label";

export function NewTaskModal({
  classId,
  userId,
}: {
  classId: string;
  userId: string;
}) {
  const createNewConfig = useCreateNewConfig();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useAtom(newTaskModalAtom);
  const [error, setError] = useState("");

  const types: TaskType[] = ["lesson", "ai-test", "test", "chat"];

  const formSchema = z.object({
    taskName: z.string().min(3).max(50),
    type: z.string(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { taskName, type } = values;
    if (
      type === "chat" ||
      type === "test" ||
      type === "lesson" ||
      type === "ai-test"
    ) {
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
    } else {
      setError("Please select a task type");
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      type: "",
    },
  });

  const getTypeIcon = (type: TaskType) => {
    const { Icon } = getTaskProperties(type);
    return <Icon />;
  };

  return (
    <Dialog
      modal={true}
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        form.reset();
        setError("");
      }}
    >
      <DialogOverlay />
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="group flex items-center justify-end gap-2 border border-primary text-primary hover:bg-primary"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="h-4 w-4" />
          <div className="font-bold">New Task</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-5 text-2xl font-medium">
            New Task
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <RadioGroup
                    onValueChange={field.onChange}
                    className="flex justify-around gap-4"
                  >
                    {types.map((type, index) => (
                      <FormItem key={index}>
                        <FormLabel className="flex cursor-pointer flex-col items-center gap-2 [&:has([data-state=checked])>div>span]:block [&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value={type} className="sr-only" />
                          </FormControl>
                          <div className="relative rounded-full border-2 p-4 text-5xl hover:border-primary active:translate-y-1">
                            {getTypeIcon(type)}
                            <span className="absolute -right-1 top-0 hidden rounded-full bg-base-200 text-2xl text-primary">
                              <IoIosCheckmarkCircle />
                            </span>
                          </div>
                          <span>{getTaskProperties(type).formattedType}</span>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem className="my-8">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="pb-2 text-sm text-error">{error}</p>}
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
