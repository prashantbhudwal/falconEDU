"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import loadingBall from "@/public/animations/loading-ball.json";
import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { checkTest } from "@/app/(schools)/dragon/ai/test-checker";
import { submitTestModalAtom } from "@/lib/atoms/ui";
import { useAtom } from "jotai";
import { db } from "@/lib/routers";

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  testBotId: string;
  redirectUrl: string;
  botChatId: string;
  isMultipleChats?: boolean;
};
const SubmitTestButton = React.forwardRef<HTMLButtonElement, PropTypes>(
  ({ testBotId, redirectUrl, botChatId, className }, ref) => {
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const [showSubmitModal, setShowSubmitModal] = useAtom(submitTestModalAtom);

    const saveTestHandler = async () => {
      try {
        setLoading(true);
        const testResults = await checkTest({ botChatId: botChatId });
        if (testResults) {
          await db.student.botChat.saveTestResultsByBotChatId({
            botChatId,
            testResults,
          });
          await db.student.botChat.submitBotChat({ botChatId });
          setLoading(false);
          return { success: true };
        }
        setLoading(false);
        return { success: false };
      } catch (err) {
        setLoading(false);
        setShowDialog(false);
        console.log(err);
        return { success: false };
      }
    };

    const handleSubmit = async () => {
      setShowDialog(true);
      const { success }: { success: boolean } = await saveTestHandler();
      if (!success) {
        setLoading(false);
        setShowDialog(false);
        return;
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setShowDialog(false);
        router.push(redirectUrl);
      }, 3000);
    };

    return (
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogTrigger>
          <Button className={className} size={"sm"}>
            Submit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to submit?</DialogTitle>
            <DialogDescription>
              Test will submitted, and the teacher will see it.
            </DialogDescription>
            <div className="flex items-center justify-end gap-5 py-1">
              <Dialog open={showDialog}>
                <DialogContent className="mx-auto w-11/12 flex-col items-center">
                  <DialogHeader className="rounded-t-lg p-4">
                    <DialogTitle className="mb-2 flex items-center text-lg">
                      {loading
                        ? "Submitting..."
                        : "Good Job! Taking you home..."}
                    </DialogTitle>
                    {loading && <Lottie animationData={loadingBall} />}
                    {isSubmitted && (
                      <Lottie animationData={testCheckAnimation} />
                    )}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button
                ref={ref}
                size={"sm"}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting" : "Submit"}
              </Button>
              <DialogClose>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  },
);

SubmitTestButton.displayName = "SubmitTestButton";

export default SubmitTestButton;
