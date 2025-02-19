// TODO: Refactor this code, this is a mess. This code is so poorly written that the author should be ashamed of himself.
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
import { trackEvent } from "@/lib/mixpanel";
import { useSession } from "next-auth/react";

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
  const session = useSession();
  const teacherEmail = session.data?.user?.email as string;
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

  const studentEmail = form.getValues().email;

  // TODO: Refactor this code
  const onSubmit = async function (
    values: z.infer<typeof addStudentFormSchema>,
  ) {
    let { email } = values;
    email = email.replace(/^www\./, "");
    const result = await db.studentRouter.addStudentToClass({ email, classId });
    if (result.notFound) {
      setIsNotOnFalconAI(true);
    } else if (result.error) {
      form.setError("email", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
    } else if (result.success) {
      trackEvent("teacher", "student_added", {
        distinct_id: teacherEmail,
        student_email: email,
        class_id: classId,
      });
      cancelModalHandler();
    }
  };

  // TODO: Clean up this mess
  const sendEmailHandler = async () => {
    try {
      setSendingEmail(true);
      const { success, error, addedInvitation } =
        await db.inviteStudentsRouter.addToInviteList({
          classId,
          studentEmail: studentEmail,
        });
      if (!success && error) {
        setSendingEmail(false);
        setIsAlreadyInvited(true);
        setEmailError(error);
        return;
      }
      const data = {
        studentEmail: studentEmail,
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
        trackEvent("teacher", "student_invited", {
          distinct_id: teacherEmail,
          class_id: classId,
          student_email: studentEmail,
        });
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
          studentEmail: studentEmail,
        });
      if (!success && error) {
        setSendingEmail(false);
        setEmailError(error);
        return;
      }
      const data = {
        studentEmail: studentEmail,
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
        trackEvent("teacher", "student_invited", {
          distinct_id: teacherEmail,
          class_id: classId,
          student_email: studentEmail,
        });
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
  const email = form.getValues().email;
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
          <DialogHeader className="flex flex-col">
            {!isNotOnFalconAI ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <h3 className=" text-2xl font-bold">Add Student</h3>
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
                  <p className="text-sm text-info">
                    Once added, students will see all tasks in the class.
                  </p>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col space-y-6">
                <DialogTitle className="font-semibold">
                  <span className="text-warning">{email}</span> is not joined
                  joined FalconAI yet.
                </DialogTitle>
                <div className="flex gap-5">
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
                    <Button onClick={sendEmailHandler}>
                      {sendingEmail ? (
                        <span className="loading loading-infinity loading-md"></span>
                      ) : (
                        <span className="flex items-center gap-2 tracking-wider">
                          <LuMail />
                          Invite Student via Email
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
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
