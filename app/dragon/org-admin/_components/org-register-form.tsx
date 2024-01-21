"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { BoardName, IndianStates, OrgType, Language } from "@prisma/client";
import {
  Button,
  Flex,
  NumberInput,
  Select,
  SelectItem,
  Text,
  TextInput,
} from "@tremor/react";
import { registerOrg } from "../mutations";
import { generateOptionsFromEnum } from "@/lib/utils";

export const orgRegisterFormSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(OrgType),
  brandName: z.string().min(2),
  boardNames: z.nativeEnum(BoardName),
  city: z.string().optional(),
  state: z.nativeEnum(IndianStates).optional(),
  language_medium: z.nativeEnum(Language),
  language_native: z.string().optional(),
});

const OrgRegisterForm = ({ userId }: { userId: string }) => {
  const boardNames = generateOptionsFromEnum({
    enumObject: BoardName,
    capitalizeOptions: true,
  });
  const orgTypes = generateOptionsFromEnum({ enumObject: OrgType });
  const stateNames = generateOptionsFromEnum({ enumObject: IndianStates });
  const languageMedium = generateOptionsFromEnum({ enumObject: Language });

  const form = useForm<z.infer<typeof orgRegisterFormSchema>>({
    resolver: zodResolver(orgRegisterFormSchema),
    defaultValues: {
      name: "",
      type: "SCHOOL",
      boardNames: "CBSE",
      state: "Andhra_Pradesh",
      language_medium: "ENGLISH",
      language_native: "",
      brandName: "",
      city: "",
    },
    mode: "onChange",
  });

  const onSubmit = async function (
    values: z.infer<typeof orgRegisterFormSchema>,
  ) {
    const result = await registerOrg({ values, userId });
    if (result) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <div className="max-w-11/12 mx-auto my-10 flex h-fit items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Text className="text-center text-xl text-slate-300">
            Register Organization
          </Text>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Organization Name<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="Organization Name"
                    className={`border-red-400`}
                    error={!!form.formState.errors.name}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Brand Name<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="Brand Name"
                    error={!!form.formState.errors.name}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Type of Org.<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    {orgTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="boardNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Board name<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    {boardNames.map((name) => (
                      <SelectItem key={name.value} value={name.value}>
                        {name.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  State Name<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    {stateNames.map((name) => (
                      <SelectItem key={name.value} value={name.value}>
                        {name.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language_native"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Native language
                </FormLabel>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="Native language"
                    error={!!form.formState.errors.name}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language_medium"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left text-[9px]">
                  Medium language<sup>*</sup>
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    {languageMedium.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Flex>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left text-[9px]">
                    City Name
                  </FormLabel>
                  <FormControl>
                    <TextInput
                      autoComplete="off"
                      type="text"
                      placeholder="City Name"
                      className="w-20"
                      error={!!form.formState.errors.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Flex>
          <Flex justifyContent="center">
            <Button type="submit" className="mt-5 min-w-[100px] rounded-xl">
              Save
            </Button>
          </Flex>
        </form>
      </div>
    </Form>
  );
};

export default OrgRegisterForm;
