"use client";
import { getStudentsURL } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useSetAtom } from "jotai";
import { newTaskModalAtom } from "@/lib/atoms/ui";
import { useRouter } from "next/navigation";

export const EmptyClassCard = async ({
  classId,
  noStudents,
}: {
  classId: string;
  noStudents: boolean;
}) => {
  const router = useRouter();
  const setOpen = useSetAtom(newTaskModalAtom);
  const steps = [
    {
      stepNo: 1,
      title: "Add students to the class",
      isChecked: !noStudents,
      onClick: () => router.push(getStudentsURL(classId)),
      isActive: noStudents,
    },
    {
      stepNo: 2,
      title: "Create a new task",
      isChecked: false,
      onClick: () => setOpen(true),
      isActive: !noStudents,
    },
    {
      stepNo: 3,
      title: "Publish the task",
      isChecked: false,
      onClick: () => {},
      isActive: false,
    },
  ];

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center justify-center space-y-3 py-8">
      <ul className="space-y-10 text-xl">
        {steps.map((step) => (
          <li
            key={step.stepNo}
            className={cn("flex items-center space-x-5", {
              "disabled opacity-50": !step.isActive,
            })}
          >
            {step.isChecked ? (
              <CheckCircleIcon className="h-10 w-10 text-primary" />
            ) : (
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent/60 text-accent/60",
                  {
                    "border-none bg-accent/60 text-base-200": step.isActive,
                  },
                )}
              >
                {step.stepNo}
              </div>
            )}
            <button
              onClick={step.isActive ? step.onClick : () => {}}
              className={cn("", {
                "line-through": step.isChecked,
                disabled: !step.isActive,
                "underline decoration-slate-500 underline-offset-4 hover:cursor-pointer hover:text-slate-200 hover:decoration-accent":
                  step.isActive,
              })}
            >
              {step.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
