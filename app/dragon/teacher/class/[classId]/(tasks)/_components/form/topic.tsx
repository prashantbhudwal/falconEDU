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
import { FiInfo } from "react-icons/fi";

export const TopicField = ({ name }: { name: string }) => {
  const form = useFormContext();
  const [inputFocus, setInputFocus] = useState("");

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={`mb-3 flex w-full justify-between align-middle font-bold ${
              inputFocus === "topic" ? "text-white" : ""
            }`}
          >
            Topic
          </FormLabel>
          <FormControl>
            <Input
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
  );
};
