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
import { useCreateNewConfig } from "@/app/dragon/teacher/hooks/use-create-config";
import { getTaskProperties } from "@/app/dragon/teacher/utils";
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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const types: TaskType[] = ["chat", "test", "lesson"];

  const formSchema = z.object({
    taskName: z.string().min(3).max(50),
    type: z.string(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { taskName, type } = values;
    if (type === "chat" || type === "test" || type === "lesson") {
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
        return;
      } catch (error) {
        console.error(error);
        return;
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
          className="group flex items-center justify-end gap-2 text-primary hover:bg-primary border border-primary rounded-2xl"
          onClick={() => setOpen(true)}
        >
          <PlusIcon className="w-4 h-4" />
          <div className="font-bold">New Task</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium pb-5">
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
                    className="flex gap-4 justify-around"
                  >
                    {types.map((type, index) => (
                      <FormItem key={index}>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div>span]:block flex flex-col items-center gap-2 cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value={type} className="sr-only" />
                          </FormControl>
                          <div className="text-5xl relative p-4 border-2 rounded-full">
                            {getTypeIcon(type)}
                            <span className="absolute top-0 hidden -right-1 text-primary text-2xl bg-base-200 rounded-full">
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
            {error && <p className="text-error text-sm pb-2">{error}</p>}
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
