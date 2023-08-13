"use client";
import { IconPlus } from "./ui/icons";
import { useRouter } from "next/navigation";

export default function NewChatBtn() {
  const router = useRouter();
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        router.refresh();
        router.push("/chubbi");
      }}
      className={"btn btn-ghost btn-sm rounded-sm"}
    >
      <IconPlus />
      New Chat
    </button>
  );
}
