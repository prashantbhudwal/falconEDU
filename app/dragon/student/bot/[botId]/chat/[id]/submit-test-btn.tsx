"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import Lottie from "lottie-react";
import { useState } from "react";
import { createReportForStudents, submitTestBot } from "./mutations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReportType } from "@/app/dragon/teacher/class/[classId]/tests/edit-test/[testBotId]/report/[studentBotId]/page";
import testResult from "@/app/dragon/teacher/class/[classId]/tests/edit-test/[testBotId]/report/[studentBotId]/testResults";
import { Message } from "ai/react/dist";

export default function SubmitTestButton({
  testBotId,
  redirectUrl,
  botChatId,
  messages,
}: {
  testBotId: string;
  redirectUrl: string;
  botChatId: string;
  messages: Message[];
}) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const { report }: { report: ReportType[] } = messages.length
        ? await testResult(botChatId, messages)
        : { report: null };

      if (report) {
        await createReportForStudents(testBotId, report);
      }
      await submitTestBot(testBotId);

      setLoading(false);
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
        router.push(redirectUrl);
      }, 5000);
    } catch (err) {
      setLoading(false);
      setShowDialog(false);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog open={showDialog}>
        <DialogContent className="w-11/12 mx-auto flex-col items-center">
          <DialogHeader className="p-4 rounded-t-lg">
            <DialogTitle className="text-lg mb-2 flex items-center">
              Good Job! Taking you home...
            </DialogTitle>
            <Lottie animationData={testCheckAnimation} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Button variant={"outline"} onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting" : "Submit Test"}
      </Button>
    </div>
  );
}
