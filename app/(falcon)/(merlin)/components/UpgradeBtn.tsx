"use client";
import Link from "next/link";
import useUserData from "@/hooks/useUserData";
export default function UpgradeBtn() {
  const { user, isLoading } = useUserData();
  if (isLoading) return null;
  if (user?.role === "PRO") return null;
  return (
    <Link
      href="/pricing"
      className="btn btn-accent btn-sm rounded-sm capitalize"
    >
      Upgrade
    </Link>
  );
}
