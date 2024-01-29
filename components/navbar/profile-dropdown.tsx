import Avatar from "@/components/avatar";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-btn";
import { Button } from "../ui/button";

interface Props {
  url: string;
}

export default function ProfileDropDown({ url }: Props) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="hover:cursor-pointer hover:bg-base-300">
        <Avatar />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-32 rounded-box bg-base-100 p-2 shadow"
      >
        <li>
          <Link href={url}>Profile</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  );
}
