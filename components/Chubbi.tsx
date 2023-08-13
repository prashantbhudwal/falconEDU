"use client";
import Link from "next/link";
import Image from "next/image";
import usePageTracking from "@/hooks/usePageTracking";

export default function Chubbi() {
  const { currentPage } = usePageTracking();
  if (currentPage === "/chubbi") return null;
  return (
    <Link
      className="dropdown-end dropdown-top dropdown absolute bottom-5 right-5"
      href={"/chubbi"}
    >
      <Image src={"/chubbi.png"} height={45} width={45} alt="Falcon Logo" />
    </Link>
  );
}
