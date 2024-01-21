"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@ui/tooltip";
import usePageTracking from "@/hooks/usePageTracking";
import clsx from "clsx"; // for combining class names
import { useRouter } from "next/navigation";
import { ButtonConfig } from "@/components/navbar/use-navbar-buttons";
import useNavbarButtons from "@/components/navbar/use-navbar-buttons";
import { useEffect, useState } from "react";
import {
  getTeacherData,
  typeGetTeacherPreferences,
} from "@/app/dragon/teacher/(settings)/teacher-preferences/getTeacherData";
import { teacherPreferencesSchema } from "@/app/dragon/schema";
import { removeOptionalFieldFormZodTypes } from "@/lib/utils";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function RightActionBar() {
  const { currentPage } = usePageTracking();
  const router = useRouter();
  const buttonConfiguration = useNavbarButtons();
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const asyncFunction = async () => {
      const { preferences } = (await getTeacherData()) as {
        preferences: typeGetTeacherPreferences;
      };
      if (preferences) {
        setPreferences(preferences);
      }
    };
    asyncFunction();
  }, []);

  const createButton = (
    key: string,
    {
      name,
      href,
      linkClass,
      icon: { Icon, additionalClass },
      isEnabled = true,
      onClick,
    }: ButtonConfig,
  ) => {
    let isFormIncomplete = false;
    if (name === "My Avatar") {
      const updatedTeacherPreferencesSchema = removeOptionalFieldFormZodTypes(
        teacherPreferencesSchema,
      );
      const { success } =
        updatedTeacherPreferencesSchema.safeParse(preferences);
      if (!success) isFormIncomplete = true;
    }

    return (
      <button
        key={key}
        onClick={() => {
          onClick();
          href !== "" && router.push(href);
        }}
        className={clsx(
          `btn btn-xs relative flex place-content-center rounded-sm py-4 font-medium capitalize`,
          linkClass,
        )}
        disabled={!isEnabled}
      >
        <Icon
          className={clsx(`text-sm font-bold text-slate-600`, additionalClass)}
        />
        {name}
        {/* ---------------------------------------------- */}
        {name === "My Avatar" && isFormIncomplete && (
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger asChild>
                <span className="absolute -left-2 -top-2 h-[20px] w-[20px] text-destructive">
                  <SparklesIcon />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-base-200 text-slate-300">
                Your Avatar is Incomplete
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </button>
    );
  };

  const pageConfig = buttonConfiguration.find(({ pattern }) =>
    pattern.test(currentPage),
  );

  if (!pageConfig) return null;

  const buttons = pageConfig.buttons.map((buttonConfig) =>
    createButton(`${currentPage}-${buttonConfig.name}`, buttonConfig),
  );

  return <>{buttons}</>;
}
