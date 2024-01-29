"use client";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FiBookOpen } from "react-icons/fi";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
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
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-5 flex flex-col gap-2">
            <FormLabel className="flex items-center gap-2 font-bold">
              Subjects
            </FormLabel>
          </div>
          <div className="flex flex-row flex-wrap gap-x-6 gap-y-5 ">
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
  );
};
