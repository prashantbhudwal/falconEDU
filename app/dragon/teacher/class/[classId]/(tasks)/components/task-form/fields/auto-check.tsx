"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const AutoCheckField = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const form = useFormContext();

  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className="px-0">
          <CardTitle>AutoCheck With AI</CardTitle>
        </CardHeader>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex max-w-sm flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormDescription>
                  Automatically check and show the result to the student.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
