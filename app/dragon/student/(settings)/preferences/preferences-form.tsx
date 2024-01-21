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
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import { Paper } from "@/components/ui/paper";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { updateStudentPreferences } from "./mutations";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";
import { StudentPreferenceSchema } from "@/lib/schema";

//TODO: shifting this to a seperate schema file

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
  initialPreferences: z.infer<typeof StudentPreferenceSchema>;
  studentId: string;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof StudentPreferenceSchema>>({
    resolver: zodResolver(StudentPreferenceSchema),
    defaultValues: initialPreferences || defaultValues,
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  const onSubmit = async (data: z.infer<typeof StudentPreferenceSchema>) => {
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
    <Paper className="flex w-full flex-col items-center">
      {Object.keys(form.formState.errors).length > 0 && (
        <div className="my-2 font-semibold text-destructive">
          Please fill out all fields
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-4xl flex-col space-y-5"
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
            <div className="my-2 font-semibold text-destructive">{error}</div>
          )}
          <Button type="submit" disabled={!isDirty}>
            {isLoading ? "Saving" : isDirty ? "Save" : "Saved"}
          </Button>
        </form>
      </Form>
    </Paper>
  );
}
