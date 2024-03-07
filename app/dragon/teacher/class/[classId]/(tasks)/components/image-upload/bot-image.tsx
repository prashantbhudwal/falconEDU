import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, constructDigitalOceanUrl } from "@/lib/utils";
import Avvvatars from "avvvatars-react";
import React from "react";
import { ImageUploadDialog } from "./image-dropzone";
import { EditIcon } from "@/components/icons";
import { HostedImage } from "@prisma/client";
import { TaskType } from "@/types";

interface BotImageProps {
  taskId: string;
  taskName: string;
  className?: string;
  avatar: HostedImage | null;
  classId: string;
  type: TaskType;
}

export function BotImage({
  taskId,
  taskName,
  className,
  avatar,
  classId,
  type,
}: BotImageProps) {
  const [open, setOpen] = React.useState(false);
  const bucket = avatar?.bucket ?? "";
  const key = avatar?.key ?? "";
  const url = constructDigitalOceanUrl({ bucket, key });

  return (
    <div className="group relative w-fit">
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant={"ghost"}
        size={"icon"}
        className="absolute bottom-1/2 right-1/2 z-10 hidden translate-x-1/2 translate-y-1/2 transform rounded-full group-hover:flex group-hover:bg-accent"
      >
        <EditIcon className="" size="xs" color="base-300" />
      </Button>
      <Avatar className={cn("h-16 w-16 group-hover:blur-sm", className)}>
        <AvatarImage src={url} alt="User Avatar" />
        <AvatarFallback className="bg-base-100">
          <Avvvatars value={taskName} style="shape" />
        </AvatarFallback>
      </Avatar>
      <ImageUploadDialog
        open={open}
        setOpen={setOpen}
        taskId={taskId}
        classId={classId}
        type={type}
        avatar={avatar}
      />
    </div>
  );
}
