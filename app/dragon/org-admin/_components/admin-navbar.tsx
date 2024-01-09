import { orgAdminHomeURL } from "@/lib/urls";
import ProfileDropDown from "@/components/navbar/profile-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orgAdminProfileURL } from "@/lib/urls";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdMoreVert } from "react-icons/md";

type AdminNavbarProps = {
  title: string;
};

const AdminNavbar = ({ title }: AdminNavbarProps) => {
  return (
    <div className="flex justify-between z-20 w-full sticky top-0 left-0 items-center px-5 py-3 bg-base-300">
      <Link href={orgAdminHomeURL}>
        <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      </Link>
      <h1>{title}</h1>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <MdMoreVert className="text-2xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={"/dragon/org-admin/add-teachers"}>Add Teachers</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ProfileDropDown url={orgAdminProfileURL} />
      </div>
    </div>
  );
};

export default AdminNavbar;
