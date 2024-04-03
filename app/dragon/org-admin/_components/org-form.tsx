"use client";
import React from "react";
import * as z from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { BoardName, IndianStates, OrgType, Language } from "@prisma/client";
import { Select, SelectItem, TextInput } from "@tremor/react";
import { registerOrg } from "../mutations";
import { generateOptionsFromEnum } from "@/lib/utils";
import { updateOrg } from "@/lib/routers/org";
import { Button } from "@/components/ui/button";
import { Org } from "@prisma/client";
import { useIsFormDirty } from "@/hooks/use-is-form-dirty";

export const orgRegisterFormSchema = z.object({
  name: z.string().min(2),
  type: z.nativeEnum(OrgType),
  brandName: z.string().min(2).max(50),
  boardNames: z.nativeEnum(BoardName),
  city: z.string().optional(),
  state: z.nativeEnum(IndianStates).optional(),
  language_medium: z.nativeEnum(Language),
  language_native: z.string().optional(),
});

const defaultValues = {
  name: "",
  type: "SCHOOL",
  brandName: "",
  boardNames: "CBSE",
  city: "",
  state: "Andhra_Pradesh",
  language_medium: "ENGLISH",
  language_native: "",
} as const;

export type OrgFormValues = z.infer<typeof orgRegisterFormSchema>;

export const OrgForm = ({
  form,
  onSubmit,
  loading,
}: {
  form: UseFormReturn<OrgFormValues>;
  onSubmit: (values: any) => void;
  loading: boolean;
}) => {
  const orgTypes = generateOptionsFromEnum({ enumObject: OrgType });
  const stateNames = generateOptionsFromEnum({ enumObject: IndianStates });
  const languageMedium = generateOptionsFromEnum({ enumObject: Language });
  const boardNames = generateOptionsFromEnum({
    enumObject: BoardName,
    capitalizeOptions: true,
  });

  const { isDirty, setIsDirty } = useIsFormDirty(form);

  return (
    <Form {...form}>
      <div className="md:max-w-7/12 lg:max-w-7/12 flex h-fit w-full flex-col">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="Brand Name"
                    error={!!form.formState.errors.name}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  IIT, Stanford, something short that will used across app
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
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
                <FormLabel>Board</FormLabel>
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
            name="language_native"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Native language</FormLabel>
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
                <FormLabel>Medium of Instruction</FormLabel>
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
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <TextInput
                    autoComplete="off"
                    type="text"
                    placeholder="City Name"
                    error={!!form.formState.errors.name}
                    {...field}
                  />
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
                <FormLabel>State</FormLabel>
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
          <Button type="submit" className="w-full">
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </Form>
  );
};
OrgForm.displayName = "OrgForm";

// Create Org Form

export const RegisterOrgForm = ({
  userId,
}: {
  userId: string;
  initialValues?: z.infer<typeof orgRegisterFormSchema>;
}) => {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgRegisterFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const onSubmit = async function (
    values: z.infer<typeof orgRegisterFormSchema>,
  ) {
    setLoading(true);
    await registerOrg({ values, userId });
    setLoading(false);
  };

  return <OrgForm form={form} onSubmit={onSubmit} loading={loading} />;
};

RegisterOrgForm.displayName = "RegisterOrgForm";
OrgForm.Register = RegisterOrgForm;

// Update Org Form

export const UpdateOrgForm = ({
  initialValues,
  orgId,
}: {
  orgId: string;
  initialValues?: z.infer<typeof orgRegisterFormSchema>;
}) => {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<OrgFormValues>({
    resolver: zodResolver(orgRegisterFormSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async function (
    values: z.infer<typeof orgRegisterFormSchema>,
  ) {
    setLoading(true);
    await updateOrg({ data: values, orgId });
    setLoading(false);
  };

  return <OrgForm form={form} onSubmit={onSubmit} loading={loading} />;
};

UpdateOrgForm.displayName = "UpdateOrgForm";
OrgForm.Update = UpdateOrgForm;
