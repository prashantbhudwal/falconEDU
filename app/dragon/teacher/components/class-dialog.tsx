import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ClassDialogProps = {
  action: () => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
};

export function ClassDialog({
  action,
  trigger,
  title,
  description,
}: ClassDialogProps) {
  const [open, setOpen] = useState(false);

function handleDialogAction(e: React.MouseEvent<HTMLButtonElement>, actionCallback?: () => void, shouldOpen: boolean = false) {
  e.preventDefault();
  e.stopPropagation();
  
  if (actionCallback) {
    actionCallback();
  }

  setOpen(shouldOpen);
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e)=>  handleDialogAction(e, undefined, true)}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={(e)=>  handleDialogAction(e, undefined, false)}>
              Cancel
            </Button>
            <Button
              className="bg-error hover:bg-destructive"
              onClick={(e)=>  handleDialogAction(e, action, false)}
            >
              {title.split(" ")[0]}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
