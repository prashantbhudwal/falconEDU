"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export const CloseModalButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      className={cn("", className)}
      variant={"ghost"}
      size={"icon"}
      onClick={handleBack}
    >
      <XCircleIcon className="w-8 text-slate-500" />
    </Button>
  );
};

