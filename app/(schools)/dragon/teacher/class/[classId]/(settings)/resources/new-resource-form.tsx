"use client";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { useRouter } from "next/navigation";
import { AddIcon } from "@/components/icons";

const FormSchema = z.object({
  resourceTitle: z.string({
    required_error: "Resource title is required.",
  }),
  resourceDescription: z
    .string({
      required_error: "Resource description is required.",
    })
    .optional(),
});
interface NewResourceFormProps {
  initialValues?: z.infer<typeof FormSchema>;
  closeFormDialog?: () => void;
  classId: string;
}

export function NewResourceForm({
  initialValues,
  closeFormDialog,
  classId,
}: NewResourceFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const newResource = await db.source.mutations.addToClass({
      classId: classId,
      sourceData: {
        title: data.resourceTitle,
        description: data.resourceDescription,
        content: "",
      },
      revalidate: url.teacher.class({ classId: classId }),
    });

    if (closeFormDialog) {
      closeFormDialog();
    }
    router.push(
      url.teacher.editResource({
        classId: classId,
        resourceId: newResource.id,
      }),
    );
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="resourceTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="States of Matter" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resourceDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="What is this about? (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

export const NewResourceDialog = ({ classId }: { classId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeFormDialog = () => setIsOpen(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger>
        <Button
          variant={"default"}
          className="flex items-center space-x-2 rounded-2xl"
          size={"lg"}
        >
          <AddIcon size="sm" />
          <span>Add Resource</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Resource</DialogTitle>
        </DialogHeader>
        <NewResourceForm closeFormDialog={closeFormDialog} classId={classId} />
      </DialogContent>
    </Dialog>
  );
};
