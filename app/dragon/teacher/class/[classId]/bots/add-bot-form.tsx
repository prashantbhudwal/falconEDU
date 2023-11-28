"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "../../../routers";
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const AddBotFormSchema = z.object({
  botConfigName: z.string().min(3).max(50),
});

type AddBotFormProps = {
  classId: string;
};

export default function AddBotForm({ classId }: AddBotFormProps) {
  const { data } = useSession();
  const userId = data?.user?.id ?? "";
  const form = useForm<z.infer<typeof AddBotFormSchema>>({
    resolver: zodResolver(AddBotFormSchema),
    defaultValues: {
      botConfigName: "",
    },
  });

  const onSubmit = async function (values: z.infer<typeof AddBotFormSchema>) {
    const { botConfigName } = values;
    const botConfig = await db.botConfig.createBotConfig({
      userId,
      classId,
      configName: botConfigName,
      configType: "chat",
    });
    if (botConfig) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row gap-6"
      >
        <FormField
          control={form.control}
          name="botConfigName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Math Bot"
                  className="w-72"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create New Bot</Button>
      </form>
    </Form>
  );
}
