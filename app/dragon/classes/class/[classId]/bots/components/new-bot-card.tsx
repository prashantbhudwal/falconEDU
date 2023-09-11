"use client";
import { createBotConfig } from "../actions";
import { FaPlus } from "react-icons/fa6";
import BotCard from "./bot-preview-card";
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
import { redirect } from "next/navigation";

const formSchema = z.object({
  botConfigName: z.string().min(3).max(50),
});

export function NewBotCard({ classId }: { classId: string }) {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { botConfigName } = values;
    try {
      setLoading(true);
      const botConfig = await createBotConfig(userId, classId, botConfigName);
      setLoading(false);
      setOpen(false);
      redirect(
        `/dragon/classes/class/${classId}/bots/edit-bot/${botConfig?.id}`
      );
    } catch (error) {
      console.error(error);
    }
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botConfigName: "",
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <BotCard className="rounded-lg flex flex-row gap-2 w-full items-baseline">
          <FaPlus className="text-accent" />
          <div>New Bot</div>
        </BotCard>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Bot</DialogTitle>
          <DialogDescription>
            Create a new bot to manage your students and bots.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="botConfigName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Math Bot" {...field} />
                  </FormControl>
                  <FormDescription>Nickname for your bot.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {loading ? (
                <span className="loading loading-infinity loading-xs"></span>
              ) : (
                "Create Bot"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
