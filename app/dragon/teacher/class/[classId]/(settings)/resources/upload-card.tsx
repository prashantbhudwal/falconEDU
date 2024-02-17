"use client";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MdCloudUpload } from "react-icons/md";
import { useFileUpload } from "./use-file-upload";
import { AIMarkdown } from "@/components/chat/ai-markdown";

export function UploadCard() {
  const { text, getRootProps, getInputProps } = useFileUpload();
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Uploaded file</CardTitle>
        </CardHeader>
        <CardContent>
          <AIMarkdown content={text} />
        </CardContent>
      </Card>
      <div {...getRootProps()} className={cn("dropzone")}>
        <input {...getInputProps()} />
        <div className="flex h-11 w-11 items-center rounded-[28px]">
          <MdCloudUpload className="h-5 w-11" />
        </div>
        <span>Upload</span>
      </div>
    </div>
  );
}
