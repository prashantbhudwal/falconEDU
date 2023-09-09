"use client";
import usePageTracking from "@/hooks/usePageTracking";
import clsx from "clsx"; // for combining class names
import { useRouter } from "next/navigation";
import { ButtonConfig } from "@/hooks/useNavbarButtons";
import useNavbarButtons from "@/hooks/useNavbarButtons";

export default function MerlinActionBar() {
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
    }: ButtonConfig
  ) => (
    <button
      key={key}
      onClick={() => {
        onClick();
        href !== "" && router.push(href);
      }}
      className={clsx(`btn btn-xs py-4 rounded-sm font-medium capitalize flex place-content-center`, linkClass)}
      disabled={!isEnabled}
    >
      <Icon
        className={clsx(`text-slate-600 text-sm font-bold`, additionalClass)}
      />
      {name}
    </button>
  );

  const pageConfig = buttonConfiguration.find(({ pattern }) =>
    pattern.test(currentPage)
  );

  if (!pageConfig) return null;

  const buttons = pageConfig.buttons.map((buttonConfig) =>
    createButton(`${currentPage}-${buttonConfig.name}`, buttonConfig)
  );

  return <>{buttons}</>;
}
