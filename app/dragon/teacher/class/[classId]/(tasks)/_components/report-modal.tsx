"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { CloseModalButton } from "../[taskId]/test/_modal_archived/(.)report/[studentBotId]/close-modal-btn";

export function ReportModal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed left-0 right-0 top-0 z-10 flex justify-center bg-base-200/75 first-line:w-full"
      onClick={onClick}
    >
      <div ref={wrapper} className="relative w-full max-w-7xl">
        <CloseModalButton className="absolute right-2 top-2" />
        {children}
      </div>
    </div>
  );
}
