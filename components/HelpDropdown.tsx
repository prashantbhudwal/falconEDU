import { FaQuestion } from "react-icons/fa6";
import Link from "next/link";

export default function HelpDropdown() {
  return (
    <div className="dropdown-end dropdown-top dropdown absolute bottom-5 right-5">
      <label
        tabIndex={0}
        className="btn btn-circle btn-sm flex flex-row gap-1 bg-base-100 shadow-sm shadow-slate-950"
      >
        <FaQuestion className="text-sm font-bold text-slate-500" />
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
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
        <li>
          <Link href="https://brindle-diascia-0d5.notion.site/Terms-Conditions-eef0974ebd1143cc95fa974c0ccc446a?pvs=4">
            Terms
          </Link>
        </li>
      </ul>
    </div>
  );
}
