import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import React, { useEffect, useRef, useState } from "react";
import FileUploader from "./file-uploader";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { TbBorderCorners } from "react-icons/tb";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

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
  const { getValues, setValue } = useFormContext();
  const { name } = field as { name: string; value: string };
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [textOverflow, setTextOverflow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const container = textContainerRef.current;
    if (!container) return;
    // subtracting 20 for any padding or margin, may have to increase in case padding or margin is changed
    if (container.scrollHeight - 20 > container.clientHeight) {
      setTextOverflow(true);
    } else {
      setTextOverflow(false);
    }
  }, [field]);

  const parsedDocsHandler = async ({ docs }: { docs: string }) => {
    if (docs) {
      const test = getValues(name);
      const updatedTest = test ? test + "\n" + docs : docs;
      setValue(name, updatedTest);
      setIsDirty && setIsDirty(true);
    }
  };
  return (
    <div
      ref={textContainerRef}
      className={cn("custom-scrollbar relative h-[200px] overflow-y-scroll")}
    >
      <Textarea
        className="mb-0 mt-3 h-full resize-none border-none py-0 pb-0 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus-visible:ring-0"
        {...field}
        hasCounter={counter}
        maxChars={maxChars}
        required={required}
        placeholder={placeholder}
      />
      <div className="sticky bottom-3 float-right">
        {hasDocUploader && (
          <FileUploader
            setParsedDocs={parsedDocsHandler}
            className={className}
          />
        )}
      </div>
      {textOverflow && (
        <div
          onClick={() => setOpen(true)}
          className={cn(
            "sticky bottom-3 float-right -translate-x-2 cursor-pointer rounded-full border-[3px] border-base-100 bg-base-300 p-2 text-xl",
            className,
          )}
        >
          <TbBorderCorners />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[800px] px-0 ">
          <DialogHeader className="custom-scrollbar h-[550px] w-full overflow-y-scroll">
            <Textarea
              className="mb-0 mt-3 h-full resize-none border-none px-5 py-0 text-sm text-slate-200 outline-none placeholder:text-slate-400 focus-visible:ring-0"
              {...field}
              hasCounter={counter}
              maxChars={maxChars}
              required={required}
              placeholder={placeholder}
            />
            <div className="fixed bottom-3 right-3 w-fit">
              {hasDocUploader && (
                <FileUploader
                  setParsedDocs={parsedDocsHandler}
                  className={"bg-base-200"}
                />
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TextAreaWithUpload;
