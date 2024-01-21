import { Button } from "@/components/ui/button";

type SaveButtonProps = {
  isLoading: boolean;
  isDisabled: boolean;
  hasUnsavedChanges: boolean;
};

export const SaveButton: React.FC<SaveButtonProps> = ({
  isLoading,
  isDisabled,
  hasUnsavedChanges,
}) => {
  const buttonText = isLoading ? "Saving" : isDisabled ? "Save" : "Saved";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row gap-6">
        <Button
          variant={"default"}
          type="submit"
          className="min-w-28 border-primary text-xs"
          size={"sm"}
          disabled={isDisabled}
        >
          {isLoading ? "Saving" : hasUnsavedChanges ? "Save" : "Saved"}
        </Button>
      </div>
      {hasUnsavedChanges && (
        <div className="text-xs text-slate-500">Unsaved Changes</div>
      )}
    </div>
  );
};
