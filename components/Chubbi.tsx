"use client";
import Link from "next/link";
import Image from "next/image";
import usePageTracking from "@/hooks/usePageTracking";

export default function Chubbi() {
  const { currentPage } = usePageTracking();
  if (
    currentPage === "/chubbi" ||
    /^\/chat\/.*$/.test(currentPage) ||
    "/preferences"
  )
    return null;
  return (
    <Link
      className="dropdown-end dropdown-top dropdown absolute bottom-5 right-5"
      href={"/chubbi"}
    >
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <Image
              src={"/chubbi.png"}
              height={35}
              width={35}
              alt="Falcon Logo"
            />
          </div>
        </div>
        <div className="chat-bubble">Hi</div>
      </div>
    </Link>
  );
}
