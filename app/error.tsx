"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      <div className="flex flex-col items-center gap-5 text-center">
        <Image
          src="/chubbi-sad.png"
          alt="chubbi"
          width={200}
          height={200}
          className="rounded-full"
        />

        <div className="text-2xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
          {isOnline ? "Something went wrong!" : "You are offline!"}
        </div>
        <div className="text-lg sm:text-lg md:text-xl lg:text-2xl">
          {isOnline ? (
            <div>
              <span className="">
                If the error persists please reach out to us at:{" "}
              </span>
              <Link href="mailto:hello@falconai.in" className="font-bold">
                hello@falconai.in
              </Link>
            </div>
          ) : (
            <div>
              <span className="">Please check your internet connection.</span>
            </div>
          )}
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
    </div>
  );
}
