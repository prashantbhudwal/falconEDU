"use client";
import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TopicField = ({ name }: { name: string }) => {
  const form = useFormContext();
  const [inputFocus, setInputFocus] = useState("");

  return (
    <Card>
      <CardContent>
        <CardHeader className="px-0">
          <CardTitle>Topic</CardTitle>
        </CardHeader>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  required
                  autoComplete="off"
                  className="text-sm"
                  placeholder="Topic you want to teach. For multiple topics, separate them with commas."
                  {...field}
                  onFocus={() => setInputFocus("topic")}
                  onBlur={() => setInputFocus("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
