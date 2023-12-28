"use client";
import { Button } from "@/components/ui/button";
import { getStudentsURL } from "@/lib/urls";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@radix-ui/react-avatar";
import Link from "next/link";

export default function MyStudentsBtn({ classId }: { classId: string }) {
  return (
    <Link href={getStudentsURL(classId)}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:bg-slate-500 hover:text-text-950"
      >
        <Avatar>
          <UsersIcon className="w-5 text-secondary" />
        </Avatar>
        <div> Students</div>
      </Button>
    </Link>
  );
}
