"use client";
import { useState } from "react";
import { submitTestBot } from "./mutations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function SubmitTestButton({ testBotId }: { testBotId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    setLoading(true);
    await submitTestBot(testBotId);
    setLoading(false);
    router.push("/dragon/student");
  };

  return (
    <div className="flex justify-center">
      <Button variant={"outline"} onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting" : "Submit Test"}
      </Button>
    </div>
  );
}
