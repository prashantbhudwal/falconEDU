"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MimeTypes } from "@/app/api/parser/parser/config";
import { deleteFromDigitalOcean, uploadToDigitalOcean } from "./upload";
import { db } from "@/lib/routers";
import pRetry from "p-retry";
import { getTaskUrl } from "@/lib/urls";
import { TaskType } from "@/types";
import { HostedImage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const ACCEPTED_FILE_TYPES = {
  [MimeTypes.JPG]: [".jpg", ".jpeg"],
  [MimeTypes.PNG]: [".png"],
  [MimeTypes.WEBP]: [".webp"],
};
const toastifyPromise = (promise: Promise<any>) => {
  return toast.promise(promise, {
    loading: "Uploading image",
    success: "Uploaded successfully",
    error: "Error in uploading the file",
  });
};

const uploadAndSaveImage = async (
  formData: FormData,
  taskId: string,
  classId: string,
  type: TaskType,
  avatar: HostedImage | null,
) => {
  const promise = uploadToDigitalOcean(formData);

  const { url, key, bucket } = await promise;

  const addImageWithRetry = async () => {
    return await db.botConfig.addOrUpdateImage({
      botId: taskId,
      url,
      key,
      bucket,
      revalidationUrl: getTaskUrl({ classId, taskId, type }),
    });
  };
  const updatedImage = await pRetry(addImageWithRetry, {
    retries: 3,
  });

  if (avatar && updatedImage) {
    await deleteFromDigitalOcean({ bucket: avatar.bucket, key: avatar.key });
  }

  if (!updatedImage) {
    throw new Error("Failed to add image after all retries");
  }

  return updatedImage;
};

export function ImageUploadDialog({
  open,
  setOpen,
  taskId,
  classId,
  type,
  avatar,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskId: string;
  classId: string;
  type: TaskType;
  avatar: HostedImage | null;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const onDrop = useCallback(
    async (acceptedFiles: any, fileRejections: any) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection: any) => {
          rejection.errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast.error("File is too large. Limit is 2MB");
            }
            if (error.code === "file-invalid-type") {
              toast.error("Invalid file type. Only jpg and png are allowed");
            }
          });
        });
        return;
      }
      if (acceptedFiles.length === 0) {
        toast.error("No image uploaded");
        return;
      }
      const file = acceptedFiles[0] as File;
      const formData = new FormData();
      formData.append("file", file);
      const promise = uploadAndSaveImage(
        formData,
        taskId,
        classId,
        type,
        avatar,
      );
      toastifyPromise(promise);
      await promise;
      setOpen(false);
    },
    [],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noDrag: false,
    maxSize: 2000000, // 2MB
    accept: ACCEPTED_FILE_TYPES,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("h-2/5", {
          "ring ring-amber-400": isDragActive,
        })}
      >
        <div {...getRootProps()} className="h-full">
          <input {...getInputProps()} />
          <div
            className={cn(
              "flex h-full w-full flex-col items-center  justify-center space-y-5",
            )}
          >
            <Button>Choose Image</Button>
            <div>
              {isDragActive ? (
                <p>Drop here ...</p>
              ) : (
                <p>{"Or drag and drop an image here."}</p>
              )}
            </div>
          </div>
          <p className="w-full pb-5 text-center text-xs text-slate-600">
            {"Max Size - 500kb. Formats - jpg, png, webp"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
