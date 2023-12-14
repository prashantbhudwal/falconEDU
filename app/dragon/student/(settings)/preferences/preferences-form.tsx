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

const FormSchema = z.object({
  interests: z
    .string()
    .min(1, "Interests is required")
    .max(200, "Interests can't exceed 200 characters"),
  favoriteCartoons: z
    .string()
    .min(1, "Favorite Cartoons is required")
    .max(200, "Favorite Cartoons can't exceed 200 characters"),
  favoriteFoods: z
    .string()
    .min(1, "Favorite Foods is required")
    .max(200, "Favorite Foods can't exceed 200 characters"),
  aboutYourself: z
    .string()
    .min(1, "About Yourself is required")
    .max(500, "About Yourself can't exceed 500 characters"),
});

export function StudentPreferencesForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      interests: "",
      favoriteCartoons: "",
      favoriteFoods: "",
      aboutYourself: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
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
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </Paper>
  );
}
