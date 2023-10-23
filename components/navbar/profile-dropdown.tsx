import Avatar from "@/components/avatar";
import Link from "next/link";
import SignOutButton from "@/components/auth/sign-out-btn";

interface Props {
  url: string;
}

export default function ProfileDropDown({url}:Props) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-square btn-ghost btn-md">
        <Avatar />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-32 bg-base-100 p-2 shadow"
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
