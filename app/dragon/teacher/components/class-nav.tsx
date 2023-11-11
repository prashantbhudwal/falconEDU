"use client";
import { FaRobot } from "react-icons/fa6";
import {
  ClipboardDocumentCheckIcon,
  UserIcon,
  UsersIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/solid";
import { FaPeopleLine } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";

import {
  getBotsURL,
  getTestsUrl,
  getStudentsURL,
  getSettingsUrl,
} from "@/lib/urls";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getEditBotURL, getTestEditBotURL } from "@/lib/urls";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { _TestOverflow } from "@/components/_test-overflow";
import { Avatar } from "@radix-ui/react-avatar";
import { BotConfigs } from "../class/[classId]/layout";
export function ClassNav({
  classId,
  nameOfClass,
  testConfigs,
  botConfigs,
}: {
  classId: string;
  nameOfClass: string;
  testConfigs: BotConfigs;
  botConfigs: BotConfigs;
}) {
  return (
    <nav className="bg-base-200 w-full flex flex-col custom-scrollbar overflow-y-auto h-full py-4 space-y-1 pl-2 pb-32">
      <Header nameOfClass={nameOfClass} classId={classId} />
      <Body
        botConfigs={botConfigs}
        testConfigs={testConfigs}
        classId={classId}
      />
      <Footer classId={classId} />
    </nav>
  );
}

const Header = function ({
  nameOfClass,
  classId,
}: {
  nameOfClass: string;
  classId: string;
}) {
  return (
    <div className="text-base font-semibold text-slate-400 mb-4 text-left flex items-center justify-between">
      <div className="truncate w-[220] px-2">{nameOfClass}</div>
      <Link href={getSettingsUrl(classId)}>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="rounded-full hover:bg-base-300 hover:text-slate-400 text-slate-600"
        >
          <FiEdit className="w-6" />
        </Button>
      </Link>
    </div>
  );
};

const Footer = function ({ classId }: { classId: string }) {
  {
    /* TODO This is a big jugaad. Fix this later using flexbox. Make ths header and footer of the navbar be at the top and bottom using flexbox. */
  }
  return (
    <Link
      href={getStudentsURL(classId)}
      className="flex items-center gap-1 fixed bottom-0 left-0 w-[240px] h-10 bg-slate-800 "
    >
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 w-full hover:bg-slate-500 hover:text-slate-950"
      >
        <Avatar>
          <UsersIcon className="w-5 text-secondary" />
        </Avatar>
        <div>My Students</div>
      </Button>
    </Link>
  );
};

const Body = function ({
  botConfigs,
  testConfigs,
  classId,
}: {
  botConfigs: BotConfigs;
  testConfigs: BotConfigs;
  classId: string;
}) {
  const activeBots = botConfigs
    .filter((botConfig) => botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const archivedBots = botConfigs
    .filter((botConfig) => !botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const activeTests = testConfigs
    .filter((botConfig) => botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const archivedTests = testConfigs
    .filter((botConfig) => !botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const teacherNavConfig = [
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
    <Tabs defaultValue={teacherNavConfig[0].layoutSegment}>
      <TabsList className="grid grid-cols-2 bg-base-100 w-11/12">
        {teacherNavConfig.map((item) => (
          <TabsTrigger value={item.layoutSegment} key={item.layoutSegment}>
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {teacherNavConfig.map((item) => (
        <TabsContent
          value={item.layoutSegment}
          className="flex space-y-1 flex-col"
          key={item.layoutSegment}
        >
          <div>
            New
          </div>
          {item.activeBots.map((config) => (
            <TeacherNavItem
              key={config.id}
              name={config.name}
              layoutSegment={config.id}
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
            <TeacherNavItem
              key={config.id}
              name={config.name}
              layoutSegment={config.id}
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

const TeacherNavItem = function ({
  isArchived,
  name,
  icon,
  href,
  layoutSegment,
  isPublished,
}: {
  name: string;
  layoutSegment: string;
  href: string;
  icon?: React.ReactNode;
  isArchived?: boolean;
  isPublished?: boolean;
}) {
  const segments = useSelectedLayoutSegments();
  const currentSegment = segments[2];
  const segmentActive = currentSegment === layoutSegment;
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-md px-3 py-2 text-sm font-medium hover:text-neutral",
        {
          "text-gray-400 hover:bg-gray-800": !segmentActive,
          "text-white bg-base-100": segmentActive,
          "text-gray-600": isArchived,
        }
      )}
    >
      <div className="flex items-center gap-2 max-w-[200px]">
        {isArchived ? (
          <ArchiveBoxXMarkIcon className="w-4" />
        ) : (
          <div
            className={cn({
              "text-primary": isPublished,
            })}
          >
            {icon}
          </div>
        )}
        {isArchived ? (
          <div className="truncate w-[200px] flex items-center gap-1 text-xs font-light">
            {name}
          </div>
        ) : (
          <div className="truncate w-[200px]">{name}</div>
        )}
      </div>
    </Link>
  );
};
