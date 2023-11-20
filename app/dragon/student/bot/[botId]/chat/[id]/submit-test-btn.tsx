"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import loadingBall from "@/public/animations/loading-ball.json";
import Lottie from "lottie-react";
import { useState } from "react";
import { saveTestResultsByBotId, submitTestBot } from "./mutations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTestResults } from "@/app/dragon/ai/test-checker/get-test-results";

export default function SubmitTestButton({
  testBotId,
  redirectUrl,
}: {
  testBotId: string;
  redirectUrl: string;
}) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const saveTestHandler = async () => {
    try {
      setLoading(true);
      const testResults = await getTestResults(testBotId);
      if (testResults) {
        await saveTestResultsByBotId(testBotId, testResults);
        await submitTestBot(testBotId);
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
    <div className="flex justify-center">
      <Dialog open={showDialog}>
        <DialogContent className="w-11/12 mx-auto flex-col items-center">
          <DialogHeader className="p-4 rounded-t-lg">
            <DialogTitle className="text-lg mb-2 flex items-center">
              {loading ? "Submitting..." : "Good Job! Taking you home..."}
            </DialogTitle>
            {loading && <Lottie animationData={loadingBall} />}
            {isSubmitted && <Lottie animationData={testCheckAnimation} />}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Button variant={"outline"} onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting" : "Submit Test"}
      </Button>
    </div>
  );
}
