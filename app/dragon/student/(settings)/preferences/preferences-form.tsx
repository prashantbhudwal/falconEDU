"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { Paper } from "@/components/ui/paper";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { updateStudentPreferences } from "./mutations";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";

//TODO: shifting this to a seperate schema file
export const FormSchema = z.object({
  interests: z
    .string()
    .min(1, "Interests is required")
    .max(200, "Interests can't exceed 200 characters")
    .optional(),
  favoriteCartoons: z
    .string()
    .min(1, "Favorite Cartoons is required")
    .max(200, "Favorite Cartoons can't exceed 200 characters")
    .optional(),
  favoriteFoods: z
    .string()
    .min(1, "Favorite Foods is required")
    .max(200, "Favorite Foods can't exceed 200 characters")
    .optional(),
  aboutYourself: z
    .string()
    .min(1, "About Yourself is required")
    .max(500, "About Yourself can't exceed 500 characters")
    .optional(),
});

const defaultValues = {
  interests: "",
  favoriteCartoons: "",
  favoriteFoods: "",
  aboutYourself: "",
};

export function StudentPreferencesForm({
  initialPreferences,
  studentId,
}: {
  initialPreferences: z.infer<typeof FormSchema>;
  studentId: string;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialPreferences || defaultValues,
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError("");
    try {
      const { success } = await updateStudentPreferences({
        studentId: studentId,
        data,
      });
      if (!success) {
        setIsLoading(false);
        console.log(error);
        setError("Failed to update preferences.");
      }
      setIsDirty(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError("Failed to update preferences.");
    }
    setIsLoading(false);
  };
  return (
    <Paper className="w-full flex flex-col items-center">
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="text-destructive font-semibold my-2">
          Please fill out all fields
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-5 max-w-4xl w-full"
        >
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you like to do for fun?</FormLabel>
                <FormControl>
                  <TextareaAutosize {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="favoriteCartoons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your favorite cartoon?</FormLabel>
                <FormControl>
                  <TextareaAutosize {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="favoriteFoods"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your favorite food?</FormLabel>
                <FormControl>
                  <TextareaAutosize {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aboutYourself"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell us more about you!</FormLabel>
                <FormControl>
                  <TextareaAutosize {...field} className="" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && (
            <div className="text-destructive font-semibold my-2">{error}</div>
          )}
          <Button type="submit" disabled={!isDirty}>
            {isLoading ? "Saving" : isDirty ? "Save" : "Saved"}
          </Button>
        </form>
      </Form>
    </Paper>
  );
}
