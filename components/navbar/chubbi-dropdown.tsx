import Image from "next/image";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
export default function ChubbiDropdown() {
  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn btn-ghost btn-md flex flex-row gap-1 shadow-md shadow-slate-950"
      >
        <Image src={"/chubbi.png"} height={25} width={25} alt="Falcon Logo" />
        <FiChevronDown className="text-base font-medium text-secondary" />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
      >
        <li>
          <Link href="/preferences">New Lesson</Link>
        </li>
        <li>
          <Link href="/preferences">New Worksheet</Link>
        </li>
        <li>
          <Link href="/chubbi">New Chat</Link>
        </li>
        <li>
          <Link href="https://noteforms.com/forms/falconai-feedback-5wawej">
            Give Feedback
          </Link>
        </li>
      </ul>
    </div>
  );
}
