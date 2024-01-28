import { orgAdminHomeURL, orgAdminOrgSettingsURL } from "@/lib/urls";
import ProfileDropDown from "@/components/navbar/profile-dropdown";
import { orgAdminProfileURL } from "@/lib/urls";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "@/components/icons";

type AdminNavbarProps = {
  title: string;
};

const AdminNavbar = ({ title }: AdminNavbarProps) => {
  return (
    <div className="sticky left-0 top-0 z-20 flex w-full items-center justify-between bg-base-300 px-3 py-3">
      <Link href={orgAdminHomeURL}>
        <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      </Link>
      <h1>{title}</h1>
      <div className="flex w-fit flex-row items-center gap-2">
        <Link href={orgAdminOrgSettingsURL}>
          <Button
            variant={"outline"}
            size={"icon"}
            className="rounded-full border-none"
          >
            <Settings />
          </Button>
        </Link>
        <ProfileDropDown url={orgAdminProfileURL} />
      </div>
    </div>
  );
};

export default AdminNavbar;
