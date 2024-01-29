"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LuMail } from "react-icons/lu";
import { useState } from "react";
import axios from "axios";
import useUserData from "@/hooks/useUserData";
import { db } from "@/lib/routers";
import { IoMdAdd } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const addStudentFormSchema = z.object({
  email: z.string().email().nonempty(),
});

type AddStudentFormProps = {
  classId: string;
  nameOfClass: string;
};

const getInviteLink = (inviteId: string | undefined) =>
  `https://app.falconai.in/dragon/auth/student?inviteId=${inviteId}`;

export default function AddStudentForm({
  classId,
  nameOfClass,
}: AddStudentFormProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUserData();
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [alreadyInvited, setIsAlreadyInvited] = useState(false);
  const [isNotOnFalconAI, setIsNotOnFalconAI] = useState(false);

  const form = useForm<z.infer<typeof addStudentFormSchema>>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async function (
    values: z.infer<typeof addStudentFormSchema>,
  ) {
    let { email } = values;
    email = email.replace(/^www\./, "");
    const result = await db.studentRouter.addStudentToClass({ email, classId });
    if (result.notFound) {
      setIsNotOnFalconAI(true);
      // form.setError("email", {
      //   type: "manual",
      //   message: "Student not on FalconAI. Ask them to sign up!",
      // });
    } else if (result.error) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } else if (result.success) {
      cancelModalHandler();
    }
  };

  const sendEmailHandler = async () => {
    try {
      setSendingEmail(true);
      const { success, error, addedInvitation } =
        await db.inviteStudentsRouter.addToInviteList({
          classId,
          studentEmail: form.getValues().email,
        });
      if (!success && error) {
        setSendingEmail(false);
        setIsAlreadyInvited(true);
        setEmailError(error);
        return;
      }
      const data = {
        studentEmail: form.getValues().email,
        teacherEmail: user.email,
        nameOfClass,
        teacherImage: user.image,
        inviteLink: getInviteLink(addedInvitation?.id),
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data),
      );
      if (emailResponse.status === 200) {
        setOpenDialog(false);
        setEmailError("");
        setIsAlreadyInvited(false);
        setIsNotOnFalconAI(false);
        form.reset();
      }
    } catch (err) {
      console.log(err);
      setEmailError("Can't sent Email");
    }
    setSendingEmail(false);
  };

  const resendEmailHandler = async () => {
    try {
      setSendingEmail(true);
      const { success, updatedInvitation, error } =
        await db.inviteStudentsRouter.updateInviteTimehandler({
          classId,
          studentEmail: form.getValues().email,
        });
      if (!success && error) {
        setSendingEmail(false);
        setEmailError(error);
        return;
      }
      const data = {
        studentEmail: form.getValues().email,
        teacherEmail: user.email,
        nameOfClass,
        teacherImage: user.image,
        inviteLink: getInviteLink(updatedInvitation?.id),
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data),
      );
      if (emailResponse.status === 200) {
        setOpenDialog(false);
        setEmailError("");
        setIsAlreadyInvited(false);
        setIsNotOnFalconAI(false);
        form.reset();
      }
    } catch (err) {
      console.log(err);
      setEmailError("Can't sent Email");
    }
    setSendingEmail(false);
  };

  const cancelModalHandler = () => {
    setOpenDialog(false);
    setIsAlreadyInvited(false);
    setEmailError("");
    setIsNotOnFalconAI(false);
    form.reset();
  };

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger onClick={() => setOpenDialog(true)}>
            <div className="box-border flex h-8 w-8 items-center justify-center rounded-full border-2 border-base-100 transition-all hover:border-4">
              <IoMdAdd className="text-lg" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-slate-200">
            <p>Add to Class</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openDialog} onOpenChange={cancelModalHandler}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            {!isNotOnFalconAI ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <h3 className="text-center text-2xl font-bold">
                    Add or Invite Students
                  </h3>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter student email."
                            className="w-full min-w-72"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className=" w-full">
                    Add to class
                  </Button>
                  <p className="text-xs">
                    <span className="font-semibold text-slate-200">Note:</span>{" "}
                    Once published, students can see all tasks in the class.
                  </p>
                </form>
              </Form>
            ) : (
              <>
                <p className="text-sm">
                  This email is not registered with FalconAI
                </p>
                <DialogTitle className="pb-2 pt-5 text-2xl text-slate-100">
                  Invite this student to FalconAI
                </DialogTitle>
                <div className="flex justify-center gap-5">
                  {alreadyInvited && (
                    <Button
                      variant={"secondary"}
                      onClick={cancelModalHandler}
                      disabled={sendingEmail}
                      className="w-fit disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Cancel
                    </Button>
                  )}
                  {!alreadyInvited ? (
                    <Button onClick={sendEmailHandler} className="w-[150px]">
                      {sendingEmail ? (
                        <span className="loading loading-infinity loading-md"></span>
                      ) : (
                        <span className="flex items-center gap-2 tracking-wider">
                          <LuMail />
                          Invite
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={resendEmailHandler} className="w-[150px]">
                      {sendingEmail ? (
                        <span className="loading loading-infinity loading-md"></span>
                      ) : (
                        <span className="flex items-center gap-2 tracking-wider">
                          <LuMail />
                          Invite Again
                        </span>
                      )}
                    </Button>
                  )}
                </div>
                {emailError && (
                  <p className="pt-1 text-xs text-error">{emailError}</p>
                )}
                <DialogDescription className="pt-5 text-center text-xs">
                  We&apos;ll send an email invitation to join your class, and
                  your email address will be included in the message so that the
                  student is aware of who extended the invitation.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
