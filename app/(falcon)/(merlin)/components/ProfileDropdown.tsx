import Avatar from "./Avatar";
import Link from "next/link";
import SignOutButton from "./SignOutBtn";
export default function ProfileDropDown() {
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
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  );
}
