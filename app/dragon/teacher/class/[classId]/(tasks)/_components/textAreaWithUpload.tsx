import { TextareaWithCounter as Textarea } from "@/components/ui/textarea-counter";
import React, { HTMLProps } from "react";
import FileUploader from "./file-uploader";
import { useForm, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

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

  const parsedDocsHandler = async ({ docs }: { docs: string }) => {
    if (docs) {
      const test = getValues(name);
      const updatedTest = test ? test + "\n" + docs : docs;
      setValue(name, updatedTest);
      setIsDirty && setIsDirty(true);
    }
  };
  return (
    <div className={cn("relative")}>
      <Textarea
        className="resize-none mt-5 text-sm placeholder:text-slate-400 text-slate-200 h-96 focus-visible:ring-0 outline-none border-none"
        {...field}
        hasCounter={counter}
        maxChars={maxChars}
        required={required}
        placeholder={placeholder}
      />
      {hasDocUploader && (
        <FileUploader setParsedDocs={parsedDocsHandler} className={className} />
      )}
    </div>
  );
};

export default TextAreaWithUpload;
