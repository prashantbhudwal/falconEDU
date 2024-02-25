import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { TbBorderCorners } from "react-icons/tb";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useFileUpload } from "../../(settings)/resources/edit/[resourceId]/use-file-upload";
import { Button } from "@/components/ui/button";
import { AttachmentIcon } from "@/components/icons";

type PropType = {
  counter?: boolean;
  maxChars?: number;
  required?: boolean;
  placeholder?: string;
  hasDocUploader?: boolean;
  className?: string;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TextAreaWithUpload = ({
  counter,
  maxChars,
  required,
  placeholder,
  hasDocUploader,
  className,
  setIsDirty,
  ...field
}: PropType) => {
  const { text, getRootProps, getInputProps } = useFileUpload();
  const form = useFormContext();
  const { name } = field as { name: string; value: string };
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (text) parsedDocsHandler({ docs: text });
  }, [text]);

  const parsedDocsHandler = async ({ docs }: { docs: string }) => {
    if (docs) {
      const test = form.getValues(name);
      const updatedTest = test ? test + "\n" + docs : docs;
      form.setValue(name, updatedTest);
      setIsDirty && setIsDirty(true);
    }
  };
  const renderTextArea = () => {
    return (
      <Textarea
        className="mb-0 mt-3 h-full resize-none border-none py-0 pb-0 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus-visible:ring-0"
        {...field}
        hasCounter={counter}
        maxChars={maxChars}
        required={required}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div ref={textContainerRef} className={cn("relative h-[200px]")}>
      {renderTextArea()}
      <footer className="absolute bottom-3 right-4 flex items-center space-x-2">
        <div {...getRootProps()} className={cn("dropzone", className)}>
          <input {...getInputProps()} />
          <Button
            variant={"outline"}
            size={"icon"}
            className="rounded-full"
            type="button"
          >
            <AttachmentIcon size="xs" className="-rotate-45" />
          </Button>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setOpen(true)}
          className="rounded-full"
          type="button"
        >
          <TbBorderCorners />
        </Button>
      </footer>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-5/6 w-full max-w-4xl px-0 ">
          <DialogHeader className="w-full">{renderTextArea()}</DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextAreaWithUpload;
