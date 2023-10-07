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
import IconCard from "./icon-card";
import { deleteClassByClassId } from "./delete-classpage";

export function DeleteClassPageWarning({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconCard
          text="Delete Class"
          className="border-secondary border-2 border-red-400 h-12 w-40  rounded-full hover:bg-red-400 hover:text-white cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Class</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this class?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              className="bg-error hover:bg-red-400"
              onClick={() => {
                deleteClassByClassId(classId);
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
