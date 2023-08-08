import Link from "next/link";
import BreadCrumbs from "./BreadCrumbs";
import ChubbiDropdown from "./ChubbiDropdown";
import ProfileDropDown from "./ProfileDropdown";
import MerlinActionBar from "./MerlinActionBar";
import { FiZap } from "react-icons/fi";
export default function Navbar() {
  return (
    <div className="navbar bg-base-200 h-2 shadow-sm shadow-base-100">
      <div className="navbar-start gap-4 pr-2">
        <ChubbiDropdown />
        <Link
          href="/pricing"
          className="btn btn-accent rounded-sm btn-sm capitalize"
        >
          Upgrade
        </Link>
      </div>
      <div className="navbar-center">
        <BreadCrumbs />
      </div>
      <div className="navbar-end gap-3 pr-1">
        <MerlinActionBar />
        <ProfileDropDown />
      </div>
    </div>
  );
}
