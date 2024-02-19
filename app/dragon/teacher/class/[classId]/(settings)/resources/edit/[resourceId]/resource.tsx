"use client";
import { Source } from "@prisma/client";
import { UploadCard } from "./upload-card";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AIMarkdown } from "@/components/chat/ai-markdown";
import { useFileUpload } from "./use-file-upload";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaximizeIcon } from "@/components/icons";

export function Resource({ resource }: { resource: Source }) {
  const { title, description } = resource;
  const [showDialog, setShowDialog] = useState(false);
  const { text, getRootProps, getInputProps } = useFileUpload();
  const [content, setContent] = useState(resource.content);
  useEffect(() => {
    setContent((prevContent) => `${prevContent}\n${text}`);
  }, [text]);

  return (
    <div className="flex h-full flex-col space-y-5">
      <Card className="mb-0 flex h-[90%] flex-col space-y-2 bg-base-200 px-2">
        <CardHeader className="flex-none text-white">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="custom-scrollbar flex-grow overflow-y-auto rounded bg-base-300/30 p-3 shadow-inner shadow-base-300/60">
          <AIMarkdown content={content} />
          <InDialog
            isOpen={showDialog}
            setIsOpen={setShowDialog}
            component={<AIMarkdown content={content} />}
          />
        </CardContent>
        <CardFooter className="flex flex-none flex-row items-center justify-between p-0">
          <div
            {...getRootProps()}
            className={cn(
              "dropzone flex-none select-none self-center py-3 hover:cursor-pointer",
            )}
          >
            <input {...getInputProps()} />
            <UploadCard />
          </div>
          <Button
            onClick={() => {
              setShowDialog(true);
            }}
            variant={"ghost"}
            size={"icon"}
          >
            <MaximizeIcon size="sm" color="slate" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const InDialog = ({
  isOpen,
  setIsOpen,
  component,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  component: React.ReactNode;
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen} modal>
      <DialogContent className="custom-scrollbar h-[95%] max-w-6xl overflow-y-auto">
        {component}
      </DialogContent>
    </Dialog>
  );
};
