"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
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

      const testResults = await getTestResults(testBotId);

      if (testResults) {
        await saveTestResultsByBotId(testBotId, testResults);
        await submitTestBot(testBotId);
      }
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
