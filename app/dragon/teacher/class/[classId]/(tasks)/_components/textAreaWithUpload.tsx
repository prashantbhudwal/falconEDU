import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import React, { HTMLProps, useEffect, useRef, useState } from "react";
import FileUploader from "./file-uploader";
import { useForm, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { TbBorderCorners } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PropType = {
  counter?: boolean;
  maxChars?: number;
  required?: boolean;
  placeholder?: string;
  hasDocUploader?: boolean;
  className?: string;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders a TextArea component with an optional file uploader.
 * Always use this inside the FormProvider from react-hook-form
 *
 * @param {number} props.counter - The counter value.
 * @param {number} props.maxChars - The maximum number of characters allowed in the TextArea.
 * @param {boolean} props.required - Whether the TextArea is required.
 * @param {string} props.placeholder - The placeholder text for the TextArea.
 * @param {boolean} props.hasDocUploader - Whether to show the file uploader.
 * @param {string} props.className - Additional CSS classes for the component.
 * @return {JSX.Element} The rendered TextAreaWithUpload component.
 */
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
      className={cn("relative h-[200px] overflow-y-scroll custom-scrollbar")}
    >
      <Textarea
        className="resize-none mt-3 pb-0 mb-0 text-sm placeholder:text-slate-400 text-slate-200 py-0 h-full focus-visible:ring-0 outline-none border-none"
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
            "sticky border-[3px] bg-base-300 cursor-pointer border-base-100 rounded-full p-2 bottom-3 float-right -translate-x-2 text-xl",
            className
          )}
        >
          <TbBorderCorners />
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-[800px] px-0 ">
          <DialogHeader className="w-full h-[550px] overflow-y-scroll custom-scrollbar">
            <Textarea
              className="resize-none mt-3 px-5 mb-0 text-sm placeholder:text-slate-400 text-slate-200 py-0 h-full focus-visible:ring-0 outline-none border-none"
              {...field}
              hasCounter={counter}
              maxChars={maxChars}
              required={required}
              placeholder={placeholder}
            />
            <div className="w-fit fixed bottom-3 right-3">
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
