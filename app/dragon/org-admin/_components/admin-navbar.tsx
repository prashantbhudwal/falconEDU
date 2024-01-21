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
import { Flex } from "@tremor/react";

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
      <Flex className="w-fit ">
        <ProfileDropDown url={orgAdminProfileURL} />
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <MdMoreVert className="text-xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href={"/dragon/org-admin/add-teachers"}>Add Teachers</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
    </div>
  );
};

export default AdminNavbar;
