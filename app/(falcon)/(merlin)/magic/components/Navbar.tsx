import ChubbiDropdown from "./ChubbiDropdown";
import ProfileDropDown from "./ProfileDropdown";
export default function Navbar() {
  return (
    <div className="navbar bg-base-200 h-2 shadow-sm shadow-base-100">
      <div className="navbar-start">
        <ChubbiDropdown />
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <div className="flex-none">
          <ProfileDropDown />
        </div>
      </div>
    </div>
  );
}
