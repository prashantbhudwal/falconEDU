"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import loadingBall from "@/public/animations/loading-ball.json";
import Lottie from "lottie-react";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { submitTestModalAtom, confettiAtom } from "@/lib/atoms/ui";
import { useAtom, useSetAtom } from "jotai";
import { TaskType } from "@/types";
import { delay } from "@/lib/utils";
import { url } from "@/lib/urls";
import { trackEvent } from "@/lib/mixpanel";
import { useSession } from "next-auth/react";
import { taskSubmissionHandlers } from "./task-submission-handlers";

type PropTypes = React.HTMLAttributes<HTMLDivElement> & {
  testBotId: string;
  redirectUrl: string;
  botChatId: string;
  isMultipleChats?: boolean;
  type: TaskType;
  autoCheck: boolean;
};

export const SubmitTestButton = React.forwardRef<HTMLButtonElement, PropTypes>(
  (
    { testBotId, redirectUrl, botChatId, className, type: taskType, autoCheck },
    ref,
  ) => {
    const session = useSession();
    const email = session.data?.user?.email;
    const [showSubmitModal, setShowSubmitModal] = useAtom(submitTestModalAtom);
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const setConfetti = useSetAtom(confettiAtom);

    const redirectHandler = useCallback(() => {
      const isCheckable = taskType === "test" || taskType === "ai-test";
      const reportUrl = url.student.taskReport({
        botId: testBotId,
        chatId: botChatId,
      });
      !isCheckable || autoCheck === false
        ? router.back()
        : router.push(reportUrl);
    }, [autoCheck, router, testBotId, botChatId, taskType]);

    const handleSubmit = async () => {
      setError(false);
      setLoading(true);
      try {
        await taskSubmissionHandlers[taskType](botChatId, autoCheck);
        trackEvent("student", "task_submitted", {
          distinct_id: email as string,
          task_type: taskType,
          task_id: testBotId,
          attempt_id: botChatId,
        });
        setShowSubmitModal(false);
        setIsSubmitted(true);
        setConfetti(true);
        await delay(1000);
        redirectHandler();
      } catch (err) {
        trackEvent("student", "task_submission_failed", {
          distinct_id: email as string,
          task_type: taskType,
          task_id: testBotId,
          attempt_id: botChatId,
          isError: true,
        });
        setError(true);
        setShowSubmitModal(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogTrigger>
          <Button className={className} size={"sm"}>
            Submit
          </Button>
        </DialogTrigger>
        <DialogContent className="w-11/12">
          {error ? <ErrorHeader /> : <SubmitHeader />}
          <DialogFooter>
            <div className="flex items-center justify-end gap-5 py-1">
              {loading && (
                <SubmitLoader loading={loading} isSubmitted={isSubmitted} />
              )}

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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

const ErrorHeader = () => (
  <DialogHeader className="text-left">
    <DialogTitle className="text-error">Error submitting the test!</DialogTitle>
    <DialogDescription className="text-error">
      Please try again.
    </DialogDescription>
  </DialogHeader>
);

const SubmitHeader = () => (
  <DialogHeader className="text-left">
    <DialogTitle>Do you want to submit?</DialogTitle>
  </DialogHeader>
);

const SubmitLoader = ({
  loading,
  isSubmitted,
}: {
  loading: boolean;
  isSubmitted: boolean;
}) => {
  return (
    <div>
      <DialogContent className="mx-auto w-11/12 flex-col items-center">
        <DialogHeader className="rounded-t-lg p-4">
          <DialogTitle className="mb-2 flex items-center text-lg">
            {loading ? "Submitting..." : "Good Job! Taking you home..."}
          </DialogTitle>
          {isSubmitted ? (
            <Lottie animationData={testCheckAnimation} />
          ) : (
            <Lottie animationData={loadingBall} />
          )}
        </DialogHeader>
      </DialogContent>
    </div>
  );
};

SubmitTestButton.displayName = "SubmitTestButton";
