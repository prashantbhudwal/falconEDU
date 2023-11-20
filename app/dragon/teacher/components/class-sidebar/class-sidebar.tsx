"use client";
import { FaRobot } from "react-icons/fa6";
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
import { BotConfigs } from "../../class/[classId]/layout";
import { NewConfigButton } from "./new-config-btn";
import { ClassSidebarItem } from "./class-sidebar-item";
import { useSelectedLayoutSegment } from "next/navigation";

export function ClassSidebar({
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

const Body = function ({
  botConfigs,
  testConfigs,
  classId,
}: {
  botConfigs: BotConfigs;
  testConfigs: BotConfigs;
  classId: string;
}) {
  const layoutSegment = useSelectedLayoutSegment();
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
        layoutSegment === "settings" || layoutSegment === "students"
          ? "bots"
          : layoutSegment || teacherSidebarConfig[0].layoutSegment
      }
    >
      <TabsList className="grid grid-cols-2 bg-base-100 w-11/12">
        {teacherSidebarConfig.map((item) => (
          <TabsTrigger value={item.layoutSegment} key={item.layoutSegment}>
            {item.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {teacherSidebarConfig.map((item) => (
        <TabsContent
          value={item.layoutSegment}
          className="flex space-y-1 flex-col"
          key={item.layoutSegment}
        >
          <NewConfigButton
            classId={classId}
            layoutSegment={item.layoutSegment}
          />
          {item.activeBots.map((config) => (
            <ClassSidebarItem
              key={config.id}
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
