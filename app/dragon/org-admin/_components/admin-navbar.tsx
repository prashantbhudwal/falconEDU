import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoIosSettings } from "react-icons/io";

type AdminNavbarProps = {
  title: string;
};

const AdminNavbar = ({ title }: AdminNavbarProps) => {
  return (
    <div className="flex justify-between z-20 w-full sticky top-0 left-0 items-center px-5 py-3 bg-base-300">
      <Link href={"/dragon/org-admin"}>
        <Image src={"/chubbi.png"} height={30} width={30} alt="Falcon Logo" />
      </Link>
      <h1>{title}</h1>
      <div>
        <button>
          <IoIosSettings className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
