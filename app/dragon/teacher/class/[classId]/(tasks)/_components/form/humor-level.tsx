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

export const HumorLevelField = ({ name }: { name: string }) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="mb-3 flex w-56 items-center justify-between gap-2 text-xs font-bold">
            <div>Humor Level</div>
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
  );
};
