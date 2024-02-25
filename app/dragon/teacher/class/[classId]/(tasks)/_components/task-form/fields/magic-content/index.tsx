"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Grade } from "@prisma/client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextAreaField } from "./textarea";
import { IconButton } from "@/components/ui/icon-button";
import { AIMagicIcon, FolderIcon } from "@/components/icons";
import { ResourceDialog } from "./resource-dialog";
import { AIDialog } from "./ai-dialog";
import { TaskType } from "@/types";

export function MagicContentField({
  classId,
  grade,
  name,
  maxChars,
  placeholder,
  className,
  type,
}: {
  name: string;
  maxChars: number;
  placeholder: string;
  className?: string;
  classId: string;
  grade: Grade;
  type: TaskType;
}) {
  const [step, setStep] = useState<"selectContentType" | "editContent">(
    "selectContentType",
  );
  const [selectedContentType, setSelectedContentType] = useState<
    "resource" | "ai"
  >();
  const form = useFormContext();
  const contentCurrentValue = form.watch("content");
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6">
          <div className="flex items-center justify-evenly">
            <IconButton
              icon={<FolderIcon size="xxs" />}
              variant={"outline"}
              color={"primary"}
              onClick={() => {
                setSelectedContentType("resource");
                setStep("editContent");
              }}
              type="button" // Since this component is used in a form, we need to specify the type
            >
              Use a Resource
            </IconButton>
            <Separator orientation="vertical" className="h-5 w-0.5 bg-accent" />
            <IconButton
              icon={<AIMagicIcon size="xxs" />}
              variant={"outline"}
              color={"primary"}
              onClick={() => {
                setSelectedContentType("ai");
                setStep("editContent");
              }}
              type="button" // Since this component is used in a form, we need to specify the type
            >
              Use AI Magic
            </IconButton>
          </div>
          <TextAreaField
            name={name}
            maxChars={maxChars}
            placeholder={placeholder}
          />
        </CardContent>
      </Card>
      {/* Dialogs to be opened. Hidden when closed. */}
      <AIDialog
        classId={classId}
        grade={grade}
        open={selectedContentType === "ai" && step === "editContent"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setStep("selectContentType");
          }
        }}
        onAccept={(content) => {
          form.setValue("content", content);
          setStep("selectContentType"); // Optionally navigate to a different step
          form.trigger("content");
        }}
        type={type}
      />
      <ResourceDialog
        grade={grade}
        classId={classId}
        open={selectedContentType === "resource" && step === "editContent"}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setStep("selectContentType");
          }
        }}
        onSelect={(selectedContent) => {
          form.setValue("content", selectedContent);
          setStep("selectContentType");
          form.trigger("content");
        }}
      />
    </div>
  );
}
