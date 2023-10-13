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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e)=>{
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open);
      }}>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false)
                }}>
              Cancel
            </Button>
            <Button
              className="bg-error hover:bg-destructive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                action();
                setOpen(false);
              }}
            >
              {title.split(" ")[0]}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
