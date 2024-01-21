import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FiBookOpen } from "react-icons/fi";
import { useFormContext } from "react-hook-form";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import subjectsArray from "../../../../../../../data/subjects.json";
import { Grade } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import ComboBox from "@/components/combobox";

const getSubjectsForGrade = (grade: Grade) => {
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

  const subjects = getSubjectsForGrade(grade);

  const formattedSubjects = subjects.map((subject) => {
    return {
      label: subject,
      value: subject,
    };
  });
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="mb-3 flex flex-col gap-2">
            <FormLabel className="flex items-center gap-2 text-xs font-bold">
              Subjects
              <FiBookOpen />
            </FormLabel>
          </div>
          <ComboBox
            items={subjects}
            placeholder="Search subject..."
            {...field}
          />
          <Combobox
            {...field}
            items={formattedSubjects}
            placeholderText="Search subject..."
            className="w-96"
            popoverClassName="w-96"
            value={field.value}
            setValue={(value) => {
              console.log("value", [value]);
              form.setValue(name, value);
            }}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
