"use client";
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useFormContext } from "react-hook-form";
import TextAreaWithUpload from "../../textarea-with-upload";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { cn } from "@/lib/utils";

export const TextAreaField = ({
  name,
  maxChars,
  placeholder,
  className,
}: {
  name: string;
  maxChars: number;
  placeholder: string;
  className?: string;
}) => {
  const form = useFormContext();
  const { isDirty, setIsDirty } = useIsFormDirty(form);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormProvider {...form}>
            <FormControl>
              <div
                className={cn(
                  "relative min-h-[200px] w-full rounded-md border border-input bg-transparent py-2 text-sm shadow-sm sm:min-h-[150px]",
                  className,
                )}
              >
                <TextAreaWithUpload
                  counter
                  maxChars={maxChars}
                  required
                  placeholder={placeholder}
                  hasDocUploader
                  setIsDirty={setIsDirty}
                  className="bg-base-300"
                  {...field}
                />
              </div>
            </FormControl>
          </FormProvider>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
