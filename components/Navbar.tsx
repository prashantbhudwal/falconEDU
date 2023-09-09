import BreadCrumbs from "../app/(falcon)/(merlin)/components/breadcrumbs";
import ChubbiDropdown from "@/components/chubbi-dropdown";
import ProfileDropDown from "./profile-dropdown";
import MerlinActionBar from "../app/(falcon)/(merlin)/components/merlin-action-bar";
import UpgradeBtn from "./auth/upgrade-btn";
import InviteDropdown from "./invite-dropdown";
import HelpDropdown from "@/components/help-dropdown";
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
