"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormProvider, useFormContext } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import TextAreaWithUpload from "../../../../_components/textarea-with-upload";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LIMITS_testBotPreferencesSchema } from "@/lib/schema";

type AddQuestionsDialogProps = {
  loading?: boolean;
  onModalSubmit: (data: { fullTest: string; timeLimit?: number }) => Promise<{
    success: boolean;
  }>;
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  error: string | null;
};

export const AddQuestionsDialog = ({
  loading,
  onModalSubmit,
  isDirty,
  setIsDirty,
  error,
  setError,
}: AddQuestionsDialogProps) => {
  const form = useFormContext();
  const MAX_CHARS = LIMITS_testBotPreferencesSchema.fullTest.maxLength;
  const [open, setOpen] = useState(false);

  const closeModalHandler = () => {
    setOpen(false);
    form.reset();
    setIsDirty(false);
    setError("");
  };

  const submittingModalHandler = async () => {
    const values = form.getValues() as {
      fullTest: string;
      timeLimit?: number;
    };
    const { success } = await onModalSubmit(values);
    if (success) {
      closeModalHandler();
      toast.success("Questions Added Successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModalHandler}>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 border border-base-100 bg-accent/80 px-3 text-xs font-semibold text-accent-content hover:bg-accent"
          >
            Add <IoMdAdd className="text-base" />
          </TooltipTrigger>
          <TooltipContent className="bg-base-100 text-xs text-slate-200">
            <p>Add more questions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="custom-scrollbar min-w-[800px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="mt-5 flex w-full items-center justify-between">
            Add More Questions{" "}
            <div className="flex w-fit flex-col items-end gap-2">
              <Button
                onClick={submittingModalHandler}
                size={"sm"}
                disabled={loading || !isDirty}
                className="min-w-[80px] text-xs"
              >
                {loading ? (
                  <span className="loading loading-infinity loading-sm"></span>
                ) : (
                  "Save"
                )}
              </Button>
              {isDirty && (
                <div className="text-sm text-slate-500">
                  You have unsaved changes.
                </div>
              )}
            </div>
          </DialogTitle>
          <FormField
            control={form.control}
            name="fullTest"
            render={({ field }) => (
              <FormItem className="pb-10">
                <FormProvider {...form}>
                  <FormControl>
                    <div className="relative mt-5 min-h-[200px] w-full rounded-md border border-input bg-transparent py-2 text-sm shadow-sm sm:min-h-[150px]">
                      <TextAreaWithUpload
                        counter
                        maxChars={MAX_CHARS}
                        required
                        placeholder="Enter or paste the full test here. Please provide the answers too. The bot will conduct the test for you."
                        hasDocUploader
                        className="bg-base-200"
                        setIsDirty={setIsDirty}
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormProvider>
                <FormDescription>
                  {"Don't forget to provide answers."}
                </FormDescription>
                <FormMessage />
                {error && (
                  <div className="mt-3 text-sm text-error">{error}</div>
                )}
              </FormItem>
            )}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
