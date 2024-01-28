"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import loadingBall from "@/public/animations/loading-ball.json";
import Lottie from "lottie-react";
import React, { useState } from "react";
import { saveTestResultsByBotChatId, submitBotChat } from "./mutations";
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
import { checkTest } from "@/app/dragon/ai/test-checker";
import { checkAITest } from "@/app/dragon/ai/tasks/ai-test/submission";
import { submitTestModalAtom } from "@/lib/atoms/ui";
import { useAtom } from "jotai";
import { TaskType } from "@/types";
import { saveGoalAssessmentByBotChatId } from "@/app/dragon/ai/tasks/ai-test/submission/mutations";
import { cva } from "class-variance-authority";

const testHandler = async (botChatId: string) => {
  const testResults = await checkTest({ botChatId: botChatId });
  if (testResults) {
    await saveTestResultsByBotChatId({
      botChatId,
      testResults,
    });
    await submitBotChat({ botChatId });
  }
};

const aiTestHandler = async (botChatId: string) => {
  const goals = await checkAITest({ botChatId });
  if (goals) {
    await saveGoalAssessmentByBotChatId({ botChatId, goals });
  }
  await submitBotChat({ botChatId });
};

const taskHandlers: {
  [key in TaskType]: (botChatId: string) => Promise<void>;
} = {
  test: testHandler,
  "ai-test": aiTestHandler,
  lesson: async () => {},
  chat: async () => {},
};

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  testBotId: string;
  redirectUrl: string;
  botChatId: string;
  isMultipleChats?: boolean;
  type: TaskType;
};

const SubmitTestButton = React.forwardRef<HTMLButtonElement, PropTypes>(
  ({ testBotId, redirectUrl, botChatId, className, type: taskType }, ref) => {
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const [showSubmitModal, setShowSubmitModal] = useAtom(submitTestModalAtom);

    const saveTaskHandler = async ({ taskType }: { taskType: TaskType }) => {
      try {
        setLoading(true);
        await taskHandlers[taskType](botChatId);
        setLoading(false);
        setShowDialog(false);
        setShowSubmitModal(false);
        return { success: true };
      } catch (err) {
        setLoading(false);
        setShowDialog(false);
        console.log(err);
        return { success: false };
      }
    };

    const handleSubmit = async () => {
      setShowDialog(true);
      const { success }: { success: boolean } = await saveTaskHandler({
        taskType,
      });
      if (!success) {
        return;
      }
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(true);
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
