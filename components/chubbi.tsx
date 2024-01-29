"use client";
import Link from "next/link";
import Image from "next/image";
import usePageTracking from "@/hooks/usePageTracking";
import useDesktop from "@/hooks/useDesktop";

const hideChubbiRoutes: RegExp[] = [
  /^\/chubbi$/,
  /^\/profile$/,
  /^\/pricing$/,
  /^\/dragon\/.*$/,
  /^\/chat\/.*$/,
];

export default function Chubbi() {
  const { currentPage } = usePageTracking();
  const isDesktop = useDesktop();
  if (!isDesktop) return null;
  if (hideChubbiRoutes.some((route) => route.test(currentPage))) return null;

  return (
    <Link
      className="dropdown dropdown-end dropdown-top fixed bottom-5 right-5"
      href={"/chubbi"}
    >
      <div className="chat chat-end">
        <div className="avatar chat-image">
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
