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
    <div className="flex flex-col items-center justify-center h-full space-y-3 w-full max-w-xl py-8">
      <ul className="space-y-10 text-xl">
        {steps.map((step) => (
          <li
            key={step.stepNo}
            className={cn("flex items-center space-x-5", {
              "opacity-50 disabled": !step.isActive,
            })}
          >
            {step.isChecked ? (
              <CheckCircleIcon className="w-10 h-10 text-primary" />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full border-2 border-accent/60 text-accent/60",
                  {
                    "bg-accent/60 border-none text-base-200": step.isActive,
                  }
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
                "hover:decoration-accent hover:cursor-pointer underline-offset-4 underline decoration-slate-500 hover:text-slate-200":
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
