"use client";
import { FaRobot } from "react-icons/fa6";
import { ImportModal } from "../class-navbar/import-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@ui/tooltip";
import DragonHomeBtn from "@/components/navbar/dragon-home-btn";

import {
  ClipboardDocumentCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { FiEdit } from "react-icons/fi";
import {
  getBotsURL,
  getTestsUrl,
  getStudentsURL,
  getSettingsUrl,
} from "@/lib/urls";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getEditBotURL, getTestEditBotURL } from "@/lib/urls";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { NewConfigButton } from "./new-config-btn";
import { ClassSidebarItem } from "./class-sidebar-item";
import { useSelectedLayoutSegment } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { cn } from "@/lib/utils";
import { AllConfigsInClass } from "../../routers/botConfigRouter";
import { ClassesByUserId } from "../../routers/classRouter";

export function ClassSidebar({
  userId,
  classId,
  nameOfClass,
  configs,
  classesWithConfigs,
}: {
  userId: string;
  classId: string;
  nameOfClass: string;
  configs: AllConfigsInClass;
  classesWithConfigs: ClassesByUserId;
}) {
  return (
    <nav className="bg-base-200 flex flex-col custom-scrollbar overflow-y-scroll h-full py-4 space-y-1 pl-2 pb-32 w-[240px]">
      <Header nameOfClass={nameOfClass} classId={classId} />
      <Body configs={configs} classId={classId} userId={userId} />
      <Footer
        classId={classId}
        userId={userId}
        classesWithConfigs={classesWithConfigs}
      />
    </nav>
  );
}

const Body = function ({
  configs,
  classId,
  userId,
}: {
  configs: AllConfigsInClass;
  classId: string;
  userId: string;
}) {
  const layoutSegment = useSelectedLayoutSegment();
  const activeBots = configs.chat.active;
  const archivedBots = configs.chat.archived;
  const activeTests = configs.test.active;
  const archivedTests = configs.test.archived;

  //TODO: Layout segment is a bad name. Change it to something else.
  const teacherSidebarConfig = [
    {
      name: "Bots",
      activeBots,
      archivedBots,
      layoutSegment: "bots",
      href: getBotsURL(classId),
      icon: <FaRobot className="w-4" />,
    },
    {
      name: "Tests",
      activeBots: activeTests,
      archivedBots: archivedTests,
      layoutSegment: "tests",
      href: getTestsUrl(classId),
      icon: <ClipboardDocumentCheckIcon className="w-4" />,
    },
  ];
  return (
    <Tabs
      defaultValue={
        layoutSegment === "dashboard" || layoutSegment === "students"
          ? "bots"
          : layoutSegment || teacherSidebarConfig[0].layoutSegment
      }
    >
      <TabsList className="grid grid-cols-2 w-11/12 rounded-md bg-slate-800/60">
        {teacherSidebarConfig.map((item) => (
          <TabsTrigger
            value={item.layoutSegment}
            key={item.layoutSegment}
            className="rounded-md bg-none data-[state=active]:bg-slate-700/60 data-[state=active]:text-accent/80"
          >
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {teacherSidebarConfig.map((item) => (
        <TabsContent value={item.layoutSegment} key={item.layoutSegment}>
          <NewConfigButton
            classId={classId}
            layoutSegment={item.layoutSegment}
          />
          {item.activeBots.map((config) => (
            <ClassSidebarItem
              key={config.id}
              classId={classId}
              userId={userId}
              name={config.name}
              configId={config.id}
              href={
                item.layoutSegment === "bots"
                  ? getEditBotURL(classId, config.id)
                  : getTestEditBotURL(classId, config.id)
              }
              icon={item.icon}
              isPublished={config.published}
            />
          ))}
          {item.archivedBots.map((config) => (
            <ClassSidebarItem
              key={config.id}
              classId={classId}
              userId={userId}
              name={config.name}
              configId={config.id}
              href={
                item.layoutSegment === "bots"
                  ? getEditBotURL(classId, config.id)
                  : getTestEditBotURL(classId, config.id)
              }
              isArchived
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};
const Header = function ({
  nameOfClass,
  classId,
}: {
  nameOfClass: string;
  classId: string;
}) {
  const layoutSegment = useSelectedLayoutSegment();
  const isActive = layoutSegment === "dashboard";

  return (
    <Link
      href={getSettingsUrl(classId)}
      className="flex items-center mb-4 gap-2"
    >
      <DragonHomeBtn className="ring-1 ring-slate-700 rounded-lg" />
      <TooltipProvider>
        <Tooltip delayDuration={20}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "w-full text-sm text-slate-400 ring-1 ring-slate-700  truncate text-left flex items-center justify-between hover:bg-base-100 hover:text-slate-300 rounded-lg mr-2",
                {
                  "shadow-sm shadow-accent": isActive,
                }
              )}
            >
              <div className="truncate w-[100] px-2 text-xs">{nameOfClass}</div>

              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full hover:bg-base-100 hover:text-slate-400 text-slate-600"
              >
                <MdDashboard
                  className={cn("text-slate-300", {
                    "text-accent": isActive,
                  })}
                />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-base-200 text-slate-300">
            Class Dashboard
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

const Footer = function ({
  classId,
  userId,
  classesWithConfigs,
}: {
  classId: string;
  userId: string;
  classesWithConfigs: ClassesByUserId;
}) {
  {
    /* TODO This is a big jugaad. Fix this later using flexbox. Make ths header and footer of the navbar be at the top and bottom using flexbox. */
  }
  return (
    <div className="flex items-center gap-1 fixed bottom-0 left-0 w-[240px] h-10 bg-slate-800 ">
      <ImportModal
        classId={classId}
        userId={userId}
        classesWithConfigs={classesWithConfigs}
      />
    </div>
  );
};
