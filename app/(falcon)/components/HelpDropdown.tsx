import { FaQuestion } from "react-icons/fa6";
import Link from "next/link";

export default function HelpDropdown() {
  return (
    <div className="dropdown dropdown-top dropdown-end absolute bottom-5 right-5">
      <label
        tabIndex={0}
        className="btn btn-sm btn-circle flex flex-row gap-1 shadow-sm shadow-slate-950 bg-base-100"
      >
        <FaQuestion className="text-slate-500 font-bold text-sm" />
      </label>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link href="https://brindle-diascia-0d5.notion.site/Falcon-Help-f8b1691a6810473cbaa4bebb3566da90">
            Help
          </Link>
        </li>
        <li>
          <Link href="https://noteforms.com/forms/falconai-feedback-5wawej">
            Feedback
          </Link>
        </li>
        <li>
          <Link href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI">Demo</Link>
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
