"use client";
import testCheckAnimation from "@/public/animations/test-check.json";
import Lottie from "lottie-react";

import { useState } from "react";
import { submitTestBot } from "./mutations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
    setLoading(true);
    await submitTestBot(testBotId);
    setLoading(false);
    setShowDialog(true);

    setTimeout(() => {
      setShowDialog(false);
      router.push(redirectUrl);
    }, 5000);
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
