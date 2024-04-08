"use client";
import { useAtom } from "jotai";
import { backBarAtom } from "@/lib/atoms/app";
import { useEffect } from "react";

export function SetBackBar({ title, url }: { title: string; url: string }) {
  const [, setBackBar] = useAtom(backBarAtom);

  useEffect(() => {
    setBackBar({ title, url });
  }, [title, url]);

  return null;
}
