"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStudentToClass } from "./mutations";
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
    const result = await addStudentToClass(email, classId);
    if (result.notFound) {
      setOpenDialog(true);
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
      form.reset();
    }
  };

  const sendEmailHandler = async () => {
    try {
      setSendingEmail(true);
      const { success, error } =
        await db.inviteStudentsRouter.checkInviteListwithEmail({
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
        inviteLink: `https://falconai.in/dragon/student`,
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data)
      );
      if (emailResponse.status === 200) {
        const { success, error } =
          await db.inviteStudentsRouter.addToInviteList({
            classId,
            studentEmail: form.getValues().email,
          });
        setOpenDialog(false);
        setEmailError("");
        setIsAlreadyInvited(false);
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
      const data = {
        studentEmail: form.getValues().email,
        teacherEmail: user.email,
        nameOfClass,
        teacherImage: user.image,
        inviteLink: `https://falconai.in/dragon/student`,
      };
      const emailResponse = await axios.post(
        "/api/email",
        JSON.stringify(data)
      );
      if (emailResponse.status === 200) {
        const { success, error } =
          await db.inviteStudentsRouter.updateInviteTimehandler({
            classId,
            studentEmail: form.getValues().email,
          });
        setOpenDialog(false);
        setEmailError("");
        setIsAlreadyInvited(false);
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
    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter student email."
                    className="w-72"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Add to class</Button>
        </form>
      </Form>
      <Dialog open={openDialog} onOpenChange={cancelModalHandler}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center">
            <p className="text-sm">
              This email is not registered with FalconAi
            </p>
            <DialogTitle className="text-2xl pt-5 pb-2 text-slate-100">
              Invite this student to FalconAi
            </DialogTitle>
            <div className="flex gap-5 justify-center">
              {alreadyInvited && (
                <Button
                  variant={"secondary"}
                  onClick={cancelModalHandler}
                  className="w-fit"
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
              We&apos;ll send an email invitation to join your class, and your
              email address will be included in the message so that the student
              is aware of who extended the invitation.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
