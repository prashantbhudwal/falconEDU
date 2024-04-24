import prisma from "@/prisma";
import { cn, constructDigitalOceanUrl } from "@/lib/utils";
import { TaskType } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TalkButton } from "./talk-button";
import { isProduction } from "@/lib/utils";

export default async function CareerGallery() {
  const classId = isProduction
    ? "cltj928su0001147kbnpccdag"
    : "cltgwnyv30001139z6zvd873q";

  const taskType: TaskType = "chat";
  const botConfig = await prisma.botConfig.findMany({
    where: {
      classId,
      type: taskType,
      published: true,
    },
    include: {
      avatar: true,
    },
  });
  return (
    <div className=" bg-gradient-to-b from-fuchsia-950  to-slate-950">
      <div
        className={cn("flex items-center justify-between p-2 text-slate-200")}
      >
        <div className={cn("flex flex-col items-start pl-2")}>
          <div className="truncate">{"Career Gallery"}</div>
          <p className="truncate text-sm text-slate-400">
            {"Talk to AI Guides, explore careers"}
          </p>
        </div>
      </div>
      <div className="custom-scrollbar flex h-screen w-full flex-col space-y-3 overflow-y-auto px-2 pb-20 pt-2">
        {botConfig.map((config) => {
          const bucket = config.avatar?.bucket ?? "";
          const key = config.avatar?.key ?? "";
          const url = constructDigitalOceanUrl({ bucket, key });
          const description =
            config.description ??
            "This is a career bot. You can speak to it about being a doctor, engineer, or any other career you are interested in.";
          return (
            <Card key={config.id} className="bg-base-300">
              <CardHeader className=" items-center space-y-2 py-3">
                <Avatar className={cn("h-28 w-28 group-hover:blur-sm")}>
                  <AvatarImage src={url} alt="User Avatar" />
                  <AvatarFallback className="bg-base-100">
                    <Avvvatars value={config.name} style="shape" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center space-y-2  py-2">
                  <CardTitle>{config.name}</CardTitle>
                  <CardDescription className="text-center">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="w-full justify-center">
                <TalkButton config={config} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
