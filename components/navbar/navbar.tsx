import FalconBreadCrumbs from "./falcon-breadcrumbs";
import ChubbiDropdown from "@/components/navbar/chubbi-dropdown";
import ProfileDropDown from "./profile-dropdown";
import RightActionBar from "./right-action-bar";
import UpgradeBtn from "./upgrade-btn";
import InviteDropdown from "./invite-dropdown";
import HelpDropdown from "@/components/navbar/help-dropdown";
import DragonHomeBtn from "./dragon-home-btn";
import { MyClassesBtn } from "./classes-btn";
export default function Navbar() {
  return (
    <div className="navbar h-2 bg-base-200 shadow-sm shadow-base-100">
      <div className="navbar-start gap-4 pr-2">
        <ChubbiDropdown />
        <DragonHomeBtn />
        <MyClassesBtn />
        <InviteDropdown />
        <UpgradeBtn />
      </div>
      <div className="navbar-center">
        <FalconBreadCrumbs />
      </div>
      <div className="navbar-end gap-3 pr-1">
        <RightActionBar />
        <ProfileDropDown url={"/profile/teacher"} />
        <HelpDropdown />
      </div>
    </div>
  );
}
