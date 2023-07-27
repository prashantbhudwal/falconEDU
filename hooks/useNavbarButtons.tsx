import {
  FiSettings,
  FiHome,
  FiMail,
  FiDownload,
  FiSkipBack,
} from "react-icons/fi"; // import necessary icons
import { VscWand } from "react-icons/vsc";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { ComponentType, SVGProps } from "react";
import { contentStreamCompletedAtom, teachingAidsAtom } from "@/atoms/lesson";
import { useAtom } from "jotai";
import { downloadZip } from "@/utils/downloadZip";
import useDownloadContent from "@/app/(falcon)/(merlin)/magic/hooks/useDownloadContent";
import { lessonIdeasAtom } from "@/atoms/lesson";
type IconComponentProps = SVGProps<SVGSVGElement> & { className?: string };
type IconComponent = ComponentType<IconComponentProps>;

type IconConfig = {
  Icon: IconComponent;
  additionalClass?: string;
};

export type ButtonConfig = {
  name: string;
  href: string;
  linkClass?: string;
  icon: IconConfig;
  isEnabled?: boolean;
  onClick: () => void;
};

export type PageConfig = {
  pattern: RegExp;
  buttons: ButtonConfig[];
};

export default function useNavbarButtons() {
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const docxArray = useDownloadContent();
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);

  const merlinButtons: PageConfig[] = [
    {
      pattern: /^\/magic\/.*$/,
      buttons: [
        {
          name: "Planner",
          href: "/merlin",
          linkClass: "btn-secondary",
          icon: {
            Icon: FiSkipBack,
            additionalClass: "",
          },
          isEnabled: contentStreamCompleted,
          onClick: () => setTeachingAids([]),
        },
        {
          name: "Download",
          href: "",
          linkClass: "btn-accent",
          icon: {
            Icon: FiDownload,
            additionalClass: "",
          },
          isEnabled: contentStreamCompleted,
          onClick: () => downloadZip(docxArray),
        },
      ],
    },
    {
      pattern: /^\/merlin$/,
      buttons: [
        {
          name: "Plan",
          href: "/magic/aid/lesson",
          linkClass: "btn-primary",
          icon: {
            Icon: FaWandMagicSparkles,
            additionalClass: "",
          },
          onClick: () => setTeachingAids([]),
          isEnabled: lessonIdeas.length !== 0,
        },
      ],
    },
  ];

  const buttonConfiguration: PageConfig[] = [
    ...merlinButtons,
    {
      pattern: /^\/headerTest$/,
      buttons: [
        {
          name: "Generate",
          href: "generate",
          linkClass: "btn-primary",
          icon: {
            Icon: FiHome,
            additionalClass: "home-icon-class",
          },
          onClick: () => console.log("About button clicked"),
        },
        {
          name: "Download",
          href: "download",
          linkClass: "btn-accent",
          icon: {
            Icon: FiDownload,
            additionalClass: "about-icon-class",
          },
          onClick: () => console.log("About button clicked"),
        },
      ],
    },
    // add more configurations here
  ];
  return buttonConfiguration;
}
