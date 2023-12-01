"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { CloseModalButton } from "./close-modal-btn";

export default function Modal({ children }: { children: React.ReactNode }) {
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
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed z-10 left-0 right-0 top-0  bg-base-200/75 first-line:w-full flex items-end justify-end h-screen"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        style={{ width: "calc(100vw - 240px)" }}
        className=" relative top-2 shadow-lg rounded-md shadow-slate-600"
      >
        <CloseModalButton className="absolute top-2 right-2" />
        {children}
      </div>
    </div>
  );
}
