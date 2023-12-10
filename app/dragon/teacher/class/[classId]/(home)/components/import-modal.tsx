"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useDuplicateConfig } from "../../../../hooks/use-duplicate-config";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { ClassesByUserId } from "../../../../routers/classRouter";
import { useState } from "react";

export function ImportModal({
  classId,
  userId,
  classesWithConfigs,
}: {
  classId: string;
  userId: string;
  classesWithConfigs: ClassesByUserId;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { duplicateConfig } = useDuplicateConfig();
  const types = ["chat", "test"];

  const ImportFormSchema = z.object({
    classId: z.string(),
    botType: z.string(),
    configId: z.string(),
  });

  const form = useForm<z.infer<typeof ImportFormSchema>>({
    resolver: zodResolver(ImportFormSchema),
  });
  const selectedClass = form.watch("classId");
  const selectedBotType = form.watch("botType");
  const getBotOptions = () => {
    if (!selectedClass || !selectedBotType) {
      return [];
    }
    return (
      classesWithConfigs
        .find((cls) => cls.id === selectedClass)
        ?.BotConfig.filter((config) => config.type === selectedBotType) || []
    );
  };

  async function onSubmit(data: z.infer<typeof ImportFormSchema>) {
    toast({
      title: "Importing...",
    });
    await duplicateConfig({
      configId: data.configId,
      classId: classId,
      userId: userId,
    }).then(() => setIsOpen(false));
  }

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogOverlay />
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center justify-end gap-3 hover:bg-slate-500 hover:text-slate-950"
          onClick={() => setIsOpen(true)}
        >
          <div>Import</div>
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium pb-5">
            Import Bots and Tests
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Class Dropdown */}
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {classesWithConfigs.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bot Type Dropdown */}
            <FormField
              control={form.control}
              name="botType"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="What you want to import" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "test" ? "Test" : "Bot"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bot Dropdown */}
            <FormField
              control={form.control}
              name="configId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select a ${
                          selectedBotType === "test" ? "test" : "bot"
                        }`}
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {getBotOptions().map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end">
              <Button type="submit" className="ml-auto">
                Import
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
