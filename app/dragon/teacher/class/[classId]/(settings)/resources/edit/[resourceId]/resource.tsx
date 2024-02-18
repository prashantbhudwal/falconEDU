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

export function Resource({ resource }: { resource: Source }) {
  const { text, getRootProps, getInputProps } = useFileUpload();
  const { title, description } = resource;
  const [content, setContent] = useState(resource.content);
  useEffect(() => {
    setContent((prevContent) => `${prevContent}\n${text}`);
  }, [text]);

  return (
    <div className="flex h-full flex-col space-y-5">
      <div className="mb-0 h-5/6 space-y-3 rounded bg-base-200 px-2">
        <CardHeader className="text-white">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <div className="custom-scrollbar h-4/6 overflow-y-auto rounded bg-base-300/30  p-3 shadow-inner shadow-base-300/60">
          <AIMarkdown content={content} />
        </div>
        <CardFooter className="m-0 p-0">
          <div
            {...getRootProps()}
            className={cn(
              "dropzone select-none self-center py-3 hover:cursor-pointer",
            )}
          >
            <input {...getInputProps()} />
            <UploadCard />
          </div>
        </CardFooter>
      </div>
    </div>
  );
}
