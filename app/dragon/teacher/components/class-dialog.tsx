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
import { PropagationStopper } from "@/components/propagation-stopper";
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


  return (
    <PropagationStopper>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={()=>{setOpen(false)}}>
              Cancel
            </Button>
            <Button
              className="bg-error hover:bg-destructive"
              onClick={()=>{
                action();
                setOpen(false);
              }}
            >
              {title}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </PropagationStopper>
  );
}
