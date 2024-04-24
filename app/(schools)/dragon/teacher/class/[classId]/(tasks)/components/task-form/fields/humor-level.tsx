"use client";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { BsStars } from "react-icons/bs";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function getHumorLevel(sliderValue: number) {
  switch (sliderValue) {
    case 0:
      return "Low";
    case 1:
      return "Moderate";
    case 2:
      return "High";
    default:
      return "Moderate";
  }
}

export const HumorLevelField = ({
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
          <CardTitle>Humor Level</CardTitle>
        </CardHeader>
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-3 flex w-56 items-center justify-between gap-2 text-xs font-bold">
                <div className="flex items-center gap-2 text-xs">
                  <BsStars /> {field.value}
                </div>
              </FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[1]}
                  className="w-64 cursor-pointer"
                  max={2}
                  step={1}
                  onValueChange={(value) => {
                    const humourLevel = getHumorLevel(value[0]);
                    form.setValue(name, humourLevel);
                  }}
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
