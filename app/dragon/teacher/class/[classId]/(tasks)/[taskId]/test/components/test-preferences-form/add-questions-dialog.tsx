"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FieldValue, FormProvider, useFormContext } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import TextAreaWithUpload from "../../../../_components/textAreaWithUpload";
import { LIMITS_testBotPreferencesSchema } from "@/app/dragon/schema";
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
            className="text-xs flex items-center px-4 gap-1 border bg-accent/80 font-semibold border-base-100 text-accent-content hover:bg-accent"
          >
            Add <IoMdAdd className="text-base" />
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-base-100 text-slate-200">
            <p>Add more questions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="min-w-[800px] overflow-y-scroll custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex w-full items-center justify-between mt-5 text-xl">
            Add More Questions{" "}
            <div className="flex w-fit flex-col gap-2 items-end">
              <Button
                onClick={submittingModalHandler}
                disabled={loading || !isDirty}
                className="min-w-[100px]"
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
                    <div className="relative w-full mt-5 rounded-md border border-input bg-transparent px-3 py-2 shadow-sm min-h-[200px] sm:min-h-[150px] text-sm">
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
                  <div className="text-error text-sm mt-3">{error}</div>
                )}
              </FormItem>
            )}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
