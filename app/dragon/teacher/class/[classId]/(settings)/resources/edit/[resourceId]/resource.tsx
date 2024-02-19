"use client";
import { Source } from "@prisma/client";
import { UploadCard } from "./upload-card";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFileUpload } from "./use-file-upload";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingIcon, MaximizeIcon } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import useDeepCompareEffect from "use-deep-compare-effect";
import { TextareaWithCounter } from "@/components/ui/textarea-counter";
import _, { debounce } from "lodash";
import pRetry from "p-retry";
const FormSchema = z.object({
  resourceTitle: z.string({
    required_error: "Resource title is required.",
  }),
  resourceDescription: z.string({
    required_error: "Resource description is required.",
  }),

  resourceContent: z.string({
    required_error: "Resource content is required.",
  }),
});

export function Resource({
  resource,
  classId,
}: {
  resource: Source;
  classId: string;
}) {
  const [saving, setSaving] = useState(false);
  const { title, description } = resource;
  const initialValues = {
    resourceContent: resource.content,
    resourceTitle: title,
    resourceDescription: description || "",
  };
  const [showDialog, setShowDialog] = useState(false);
  const { text: parsedContent, getRootProps, getInputProps } = useFileUpload();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues,
  });

  useDeepCompareEffect(() => {
    const formValues = form.getValues();
    if (!_.isEqual(initialValues, formValues)) {
      form.reset(initialValues);
    }
  }, [resource]);

  useEffect(() => {
    form.setFocus("resourceContent");
  }, [form.setFocus]);

  useEffect(() => {
    const existingContent = form.getValues("resourceContent");
    form.setValue("resourceContent", existingContent + "\n" + parsedContent);
  }, [parsedContent]);

  const debouncedSave = useCallback(
    debounce(async () => {
      await form.handleSubmit(onSubmit)();
    }, 3000),
    [],
  );

  const formValues = form.watch();

  useDeepCompareEffect(() => {
    if (form.formState.isDirty && !form.formState.isSubmitting && !saving) {
      debouncedSave();
    }
  }, [formValues]);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (form.formState.isDirty) {
      setSaved(false);
    }
  }, [form.formState.isDirty]);
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setSaving(true);
      await pRetry(
        () =>
          db.source.mutations.update({
            sourceId: resource.id,
            sourceData: {
              title: data.resourceTitle,
              description: data.resourceDescription,
              content: data.resourceContent,
            },
            revalidate: url.teacher.class({ classId }),
          }),
        {
          retries: 3,
        },
      );
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full"
        onBlur={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex h-full flex-col space-y-5">
          <SavingLoader saving={saving} saved={saved} />
          <Card className="mb-0 flex h-[90%] flex-col space-y-2 bg-base-200 px-2">
            <CardHeader className="flex-none text-white">
              <CardTitle>
                <FormField
                  control={form.control}
                  name="resourceTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter resource title"
                          className="m-0 border-none bg-transparent p-0 text-white focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardTitle>
              <CardDescription>
                <FormField
                  control={form.control}
                  name="resourceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter resource description"
                          className="border-none bg-transparent p-0 text-white focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="custom-scrollbar flex-grow overflow-y-auto rounded bg-base-300/30 p-3 shadow-inner shadow-base-300/60">
              <InDialog isOpen={showDialog} setIsOpen={setShowDialog}>
                <FormField
                  control={form.control}
                  name="resourceContent"
                  render={({ field }) => (
                    <FormItem className="h-full">
                      <FormControl>
                        <Textarea
                          required
                          {...field}
                          className="custom-scrollbar h-full max-h-full w-full resize-none border-none bg-transparent py-0 pb-0 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </InDialog>
            </CardContent>
            <CardFooter className="flex flex-none flex-row items-center justify-between p-0">
              <div
                {...getRootProps()}
                className={cn(
                  "dropzone flex-none select-none self-center py-3 hover:cursor-pointer",
                )}
              >
                <input {...getInputProps()} />
                <UploadCard />
              </div>
              <Button
                onClick={() => {
                  setShowDialog(true);
                }}
                variant={"ghost"}
                size={"icon"}
                type="button"
              >
                <MaximizeIcon size="sm" color="slate" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}

export const InDialog = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}) => {
  return isOpen ? (
    <Dialog onOpenChange={setIsOpen} open={isOpen} modal>
      <DialogContent className="custom-scrollbar h-[95%] max-w-6xl overflow-y-auto py-10">
        {children}
      </DialogContent>
    </Dialog>
  ) : (
    <>{children}</>
  );
};

const SavingLoader = ({
  saving,
  saved,
}: {
  saving: boolean;
  saved: boolean;
}) => {
  return (
    <span className="fixed right-8 top-5 flex items-center space-x-3 text-slate-500">
      {saving ? (
        <>
          <LoadingIcon size="xs" color="slate" />
          <span>Saving</span>
        </>
      ) : saved ? (
        <span className="text-base">Saved</span>
      ) : null}
    </span>
  );
};
