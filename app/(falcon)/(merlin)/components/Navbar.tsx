import Link from "next/link";
import BreadCrumbs from "./BreadCrumbs";
import ChubbiDropdown from "./ChubbiDropdown";
import ProfileDropDown from "./ProfileDropdown";
import { FiSettings } from "react-icons/fi";
import MerlinActionBar from "./MerlinActionBar";
export default function Navbar() {
  return (
    <div className="navbar bg-base-200 h-2 shadow-sm shadow-base-100">
      <div className="navbar-start">
        <ChubbiDropdown />
      </div>
      <div className="navbar-center">
        <BreadCrumbs />
      </div>
      <div className="navbar-end gap-3 pr-1">
        <MerlinActionBar />
        <ProfileDropDown />
        <Link
          href="/preferences"
          className="btn-sm btn btn-ghost btn-square shadow-md shadow-slate-950"
        >
          <FiSettings className="text-slate-600 text-lg font-bold" />
        </Link>
      </div>
    </div>
  );
}
