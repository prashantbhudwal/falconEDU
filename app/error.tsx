"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    if (!navigator.onLine) {
      setIsOnline(false);
    }
    //TODO Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <Image
        src="/chubbi-sad.png"
        alt="chubbi"
        width={200}
        height={200}
        className="rounded-full"
      />

      <div className="text-4xl font-bold">
        {isOnline ? "Something went wrong!" : "Check your internet connection!"}
      </div>
      <div>
        <span className="">
          If the error persists please reach out to us at:{" "}
        </span>
        <Link href="mailto:hello@falconai.in" className="font-bold">
          hello@falconai.in
        </Link>
      </div>
      <Button
        variant={"secondary"}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
