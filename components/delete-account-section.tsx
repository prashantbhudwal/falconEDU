"use client";
import { db } from "../app/dragon/teacher/routers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

const deleteAccountSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
});

type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

export const DeleteAccountSection = function () {
  const { data: session } = useSession();
  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
  });
  const [openDialog, setOpenDialog] = useState(false);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return null;
  }
  const onSubmit = async (values: DeleteAccountFormValues) => {
    if (values.email !== userEmail) {
      form.setError("email", { message: "Email does not match our records." });
      return;
    }
    setOpenDialog(true);
  };

  return (
    <>
      <Separator className="bg-red-900" />
      <div className="rounded-md p-6 text-slate-400 flex flex-col space-y-4">
        <div className="flex space-x-2 items-center">
          <div className="font-bold text-error text-lg">Danger Zone</div>
          <ExclamationTriangleIcon className="text-error w-6 h-6" />
        </div>
        <DeleteAccountDialog
          open={openDialog}
          email={userEmail}
          setOpenDialog={setOpenDialog}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <FormDescription className="text-slate-500 font-semibold text-lg">
                This will permanently delete your account and all of your data.
                This action cannot be undone.
              </FormDescription>
            </div>
            <div className="flex items-center space-x-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-96">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email to confirm deletion"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" variant={"destructive"}>
                Delete Account Permanently
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

const DeleteAccountDialog = function ({
  open,
  email,
  setOpenDialog,
}: {
  open: boolean;
  email: string;
  setOpenDialog: (open: boolean) => void;
}) {
  const handleDeleteAccount = async () => {
    await db.account.deleteAccountByEmail({ email });
  };

  return (
    <Dialog open={open} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>We are sorry to see you go.</DialogTitle>
          <DialogDescription>
            Please confirm that you want to delete.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="px-3"
            variant={"destructive"}
            onClick={() => handleDeleteAccount()}
          >
            Delete my account and all my data
          </Button>
          <DialogClose asChild>
            <Button type="button" size={"sm"}>
              Give FlaconAI another try.
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
