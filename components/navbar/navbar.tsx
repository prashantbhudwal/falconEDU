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
    <div className="flex h-2 justify-between bg-base-200 shadow-sm shadow-base-100">
      <div className="flex w-2/6 gap-4 pr-2">
        <ChubbiDropdown />
        <DragonHomeBtn />
        <MyClassesBtn />
        <InviteDropdown />
        <UpgradeBtn />
      </div>
      <div className="flex">
        <FalconBreadCrumbs />
      </div>
      <div className="flex w-2/6 gap-3 pr-1">
        <RightActionBar />
        <ProfileDropDown url={"/profile/teacher"} />
        <HelpDropdown />
      </div>
    </div>
  );
}
