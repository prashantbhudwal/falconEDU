import ProfileDropDown from "@/components/navbar/profile-dropdown";
import { url } from "@/lib/urls";
import Image from "next/image";
import Link from "next/link";

type AdminNavbarProps = {
  title: string;
};

export const AdminNavbar = ({ title }: AdminNavbarProps) => {
  return (
    <div className="sticky left-0 top-0 z-20 flex w-full items-center justify-between bg-base-300 px-3 py-3">
      <Link href={url.orgAdmin.home}>
        <Image src={"/chubbi.png"} height={25} width={25} alt="Falcon Logo" />
      </Link>
      <h1>{title}</h1>
      <div className="flex w-fit flex-row items-center gap-2">
        <ProfileDropDown url={url.orgAdmin.profile} />
      </div>
    </div>
  );
};
