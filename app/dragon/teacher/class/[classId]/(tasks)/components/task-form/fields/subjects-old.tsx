"use client";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useFormContext } from "react-hook-form";
import { FiBookOpen } from "react-icons/fi";
import { getFormattedGrade } from "@/lib/helpers";
import subjectsArray from "../../../../../../../../data/subjects.json";
import { Grade } from "@prisma/client";
import { Chip } from "@/components/ui/chip";

const updateSubjectsHandler = (grade: Grade) => {
  const gradeNumber = getFormattedGrade({
    grade,
    options: { numberOnly: true },
  });
  const gradeObject = subjectsArray.filter(
    (subject) => subject.grade === gradeNumber,
  )[0];
  return gradeObject.subjects;
};

export const SubjectsField = ({
  name,
  grade,
}: {
  name: string;
  grade: Grade;
}) => {
  const form = useFormContext();
  const subjectsFromGrade = updateSubjectsHandler(grade);
  return (
    <Card>
      <CardContent>
        <CardHeader className="px-0">
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <FormField
          control={form.control}
          name={name}
          render={() => (
            <FormItem>
              <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
                {subjectsFromGrade.map((subject) => (
                  <FormField
                    key={subject}
                    control={form.control}
                    name="subjects"
                    render={({ field }) => {
                      return (
                        <FormItem key={subject}>
                          <FormControl>
                            <Chip
                              checked={field.value?.includes(subject)}
                              onCheckedChange={(checked: boolean) => {
                                return checked
                                  ? field.onChange([...field.value, subject])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== subject,
                                      ),
                                    );
                              }}
                              toggleName={subject}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
