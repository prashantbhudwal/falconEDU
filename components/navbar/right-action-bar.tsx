"use client";
import usePageTracking from "@/hooks/usePageTracking";
import { useRouter } from "next/navigation";
import { ButtonConfig } from "@/components/navbar/use-navbar-buttons";
import useNavbarButtons from "@/components/navbar/use-navbar-buttons";
import { cn } from "@/lib/utils";

export default function RightActionBar() {
  const { currentPage } = usePageTracking();
  const router = useRouter();
  const buttonConfiguration = useNavbarButtons();

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
    return (
      <button
        key={key}
        onClick={() => {
          onClick();
          href !== "" && router.push(href);
        }}
        className={cn(
          `btn btn-xs relative flex place-content-center rounded-sm py-4 font-medium capitalize`,
          linkClass,
        )}
        disabled={!isEnabled}
      >
        <Icon
          className={cn(`text-sm font-bold text-slate-600`, additionalClass)}
        />
        {name}
        {/* ---------------------------------------------- */}
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
