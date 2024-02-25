"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { mediumOfInstruction } from "@/lib/schema/constants";

export const MediumOfInstructionField = ({ name }: { name: string }) => {
  const form = useFormContext();

  return (
    <Card>
      <CardContent>
        <CardHeader className="px-0">
          <CardTitle>Medium of Instruction</CardTitle>
        </CardHeader>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  autoComplete="on"
                >
                  <SelectTrigger className="w-[250px] capitalize ">
                    <SelectValue placeholder="Medium of Instruction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      {mediumOfInstruction.map((medium) => (
                        <SelectItem
                          key={medium}
                          value={medium}
                          className="capitalize"
                        >
                          {medium}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
