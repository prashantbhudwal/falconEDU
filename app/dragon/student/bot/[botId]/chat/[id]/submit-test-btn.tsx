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
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setShowDialog(true);

      const testResults = await getTestResults(testBotId);
      if (testResults) {
        await saveTestResultsByBotId(testBotId, testResults);
        await submitTestBot(testBotId);
      }
      setLoading(false);
      setTimeout(() => {
        setShowDialog(false);
      }, 2000);
      router.push(redirectUrl);
    } catch (err) {
      setLoading(false);
      setShowDialog(false);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog open={showDialog}>
        <DialogContent className="w-11/12 mx-auto flex-col items-center">
          <DialogHeader className="p-4 rounded-t-lg">
            <DialogTitle className="text-lg mb-2 flex items-center">
              {loading ? "Submitting..." : "Good Job! Taking you home..."}
            </DialogTitle>
            {loading ? (
              <Lottie animationData={loadingBall} />
            ) : (
              <Lottie animationData={testCheckAnimation} />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Button variant={"outline"} onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting" : "Submit Test"}
      </Button>
    </div>
  );
}
