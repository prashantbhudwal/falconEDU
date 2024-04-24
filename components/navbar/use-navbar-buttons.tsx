import {
  FiSettings,
  FiHome,
  FiMail,
  FiDownload,
  FiSkipBack,
  FiSliders,
  FiTool,
  FiAirplay,
} from "react-icons/fi"; // import necessary icons
import { worksheetAnswerKeyAtom } from "@/lib/atoms/worksheet";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { ComponentType, SVGProps } from "react";
import {
  contentStreamCompletedAtom,
  teachingAidsAtom,
} from "@/lib/atoms/lesson";
import { useAtom } from "jotai";
import { downloadZip } from "@/lib/downloadZip";
import useDownloadContent from "@/app/(schools)/(engines)/(merlin)/magic/hooks/useDownloadContent";
import { lessonIdeasAtom } from "@/lib/atoms/lesson";
import { savedQuestionsAtom } from "@/lib/atoms/worksheet";
import { getWorksheetDocx } from "@/lib/getWorksheetDocx";
import { generateAnswerKeyDocx } from "@/lib/generateAnswerKeyDocx";
import { topicAtom } from "@/lib/atoms/preferences";

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
  const [savedQuestions] = useAtom(savedQuestionsAtom);
  const [worksheetAnswerKey] = useAtom(worksheetAnswerKeyAtom);
  const [__, setWorksheetAnswerKey] = useAtom(worksheetAnswerKeyAtom);
  const [lessonIdeas] = useAtom(lessonIdeasAtom);
  const [contentStreamCompleted] = useAtom(contentStreamCompletedAtom);
  const docxArray = useDownloadContent();
  const [teachingAids, setTeachingAids] = useAtom(teachingAidsAtom);
  const [topic] = useAtom(topicAtom);

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
          isEnabled: true,
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
          isEnabled: true,
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
  const raptorButtons: PageConfig[] = [
    {
      pattern: /^\/raptor\/magic\/.*$/,
      buttons: [
        {
          name: "Planner",
          href: "/raptor",
          linkClass: "btn-secondary",
          icon: {
            Icon: FiSkipBack,
            additionalClass: "",
          },
          isEnabled: true,
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
          isEnabled: true,
          onClick: () => {
            savedQuestions.length > 0 && getWorksheetDocx(savedQuestions);
            savedQuestions.length > 0 &&
              worksheetAnswerKey.length > 0 &&
              generateAnswerKeyDocx({
                topic,
                title: "Answer Key",
                fetchedContent: worksheetAnswerKey as string[],
              });
          },
        },
      ],
    },
    {
      pattern: /^\/raptor$/,
      buttons: [
        {
          name: "Generate",
          href: "/raptor/magic/worksheet",
          linkClass: "btn-secondary",
          icon: {
            Icon: FaWandMagicSparkles,
            additionalClass: "",
          },
          onClick: () => setWorksheetAnswerKey([]),
          isEnabled: true,
        },
      ],
    },
  ];
  const dragonButtons: PageConfig[] = [
    {
      pattern: /^\/dragon\/teacher$/,
      buttons: [
        {
          name: "My Avatar",
          href: "/dragon/teacher/teacher-preferences",
          linkClass: "btn-primary rounded-xl",
          icon: {
            Icon: FiSliders,
            additionalClass: "",
          },
          onClick: () => {},
          isEnabled: true,
        },
        {
          name: "Teacher Training",
          href: "/dragon/teacher/teacher-training/gallery",
          linkClass: "btn-secondary rounded-xl",
          icon: {
            Icon: FiAirplay,
            additionalClass: "",
          },
          onClick: () => {},
          isEnabled: true,
        },

        {
          name: "AI Tools",
          href: "/preferences",
          linkClass: "btn-outline border-slate-700 bg-base-100 rounded-xl",
          icon: {
            Icon: FiTool,
            additionalClass: "text-fuchsia-700",
          },
          onClick: () => {},
          isEnabled: true,
        },
      ],
    },
  ];

  const buttonConfiguration: PageConfig[] = [
    ...merlinButtons,
    ...raptorButtons,
    ...dragonButtons,
  ];
  return buttonConfiguration;
}
