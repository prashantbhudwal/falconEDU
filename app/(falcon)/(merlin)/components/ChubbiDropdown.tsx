import Image from "next/image";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
export default function ChubbiDropdown() {
  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn btn-md btn-ghost flex flex-row gap-1 shadow-md shadow-slate-950"
      >
        <Image src={"/chubbi.png"} height={25} width={25} alt="Falcon Logo" />
        <FiChevronDown className="text-secondary font-medium text-base" />
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link href="/preferences">Home</Link>
        </li>
        <li>
          <Link href="https://noteforms.com/forms/falconai-feedback-5wawej">
            Give Feedback
          </Link>
        </li>
        <li>
          <Link href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI">
            Watch the demo
          </Link>
        </li>
        <li>
          <Link href="https://www.linkedin.com/company/falconassistant/">
            LinkedIn
          </Link>
        </li>
        <li>
          <Link href="https://falconai.in">Website</Link>
        </li>
      </ul>
    </div>
  );
}
