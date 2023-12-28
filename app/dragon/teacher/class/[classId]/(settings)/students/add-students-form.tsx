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
import { db } from "@/app/dragon/teacher/routers";
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
    values: z.infer<typeof addStudentFormSchema>
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
        inviteLink: `https://chubbi.falconai.in/dragon/auth/student?inviteId=${addedInvitation?.id}`,
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data)
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
        inviteLink: `https://chubbi.falconai.in/dragon/auth/student?inviteId=${updatedInvitation?.id}`,
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data)
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
            <div className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-base-100 hover:border-4 transition-all box-border">
              <IoMdAdd className="text-lg" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-600 text-text-200">
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
                  <h3 className="text-center font-bold text-2xl">
                    Add or Invite students
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
                            className="min-w-72 w-full"
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
                    <span className="text-text-200 font-semibold">Note:</span>{" "}
                    Once published, students can see all tasks in the class.
                  </p>
                </form>
              </Form>
            ) : (
              <>
                <p className="text-sm">
                  This email is not registered with FalconAI
                </p>
                <DialogTitle className="text-2xl pt-5 pb-2 text-text-100">
                  Invite this student to FalconAI
                </DialogTitle>
                <div className="flex gap-5 justify-center">
                  {alreadyInvited && (
                    <Button
                      variant={"secondary"}
                      onClick={cancelModalHandler}
                      disabled={sendingEmail}
                      className="w-fit disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </Button>
                  )}
                  {!alreadyInvited ? (
                    <Button onClick={sendEmailHandler} className="w-[150px]">
                      {sendingEmail ? (
                        <span className="loading loading-infinity loading-md"></span>
                      ) : (
                        <span className="flex gap-2 items-center tracking-wider">
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
                        <span className="flex gap-2 items-center tracking-wider">
                          <LuMail />
                          Invite Again
                        </span>
                      )}
                    </Button>
                  )}
                </div>
                {emailError && (
                  <p className="text-error text-xs pt-1">{emailError}</p>
                )}
                <DialogDescription className="text-xs text-center pt-5">
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
