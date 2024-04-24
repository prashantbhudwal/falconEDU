"use client";
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

type DeleteDialogProps = {
  action: () => void;
  trigger: React.ReactNode;
  title: string;
  description: string;
};

export function DeleteDialog({
  action,
  trigger,
  title,
  description,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-error hover:bg-destructive"
              onClick={() => {
                action();
                setOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
