import BreadCrumbs from "../app/(falcon)/(merlin)/components/BreadCrumbs";
import ChubbiDropdown from "@/components/ChubbiDropdown";
import ProfileDropDown from "./ProfileDropdown";
import MerlinActionBar from "../app/(falcon)/(merlin)/components/MerlinActionBar";
import UpgradeBtn from "./UpgradeBtn";
import InviteDropdown from "./InviteDropDown";
import HelpDropdown from "@/components/HelpDropdown";
export default function Navbar() {
  return (
    <div className="navbar h-2 bg-base-200 shadow-sm shadow-base-100">
      <div className="navbar-start gap-4 pr-2">
        <ChubbiDropdown />
        <InviteDropdown />
        <UpgradeBtn />
      </div>
      <div className="navbar-center">
        <BreadCrumbs />
      </div>
      <div className="navbar-end gap-3 pr-1">
        <MerlinActionBar />
        <ProfileDropDown />
        <HelpDropdown />
      </div>
    </div>
  );
}
