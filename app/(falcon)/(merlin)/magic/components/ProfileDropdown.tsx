import Avatar from "./Avatar";
import Link from "next/link";
import SignOutButton from "./SignOutBtn";
export default function ProfileDropDown() {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-square">
        <Avatar />
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-32"
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
