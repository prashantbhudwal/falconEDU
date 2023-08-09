import BreadCrumbs from "./BreadCrumbs";
import ChubbiDropdown from "./ChubbiDropdown";
import ProfileDropDown from "./ProfileDropdown";
import MerlinActionBar from "./MerlinActionBar";
import UpgradeBtn from "./UpgradeBtn";
import InviteDropdown from "./InviteBtn";
export default function Navbar() {
  return (
    <div className="navbar bg-base-200 h-2 shadow-sm shadow-base-100">
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
      </div>
    </div>
  );
}
