import SignOutButton from "@/app/(falcon)/(merlin)/components/SignOutBtn";
import Link from "next/link";

export default function DesktopOnly() {
  return (
    <div className="pt-20 my-12 flex flex-col gap-8 px-4">
      <p className="text-6xl text-fuchsia-700 font-semibold">🧑‍💻</p>
      <p className="text-xl text-fuchsia-700 font-semibold">
        Laptops & larger screens only.
      </p>
      <p className="text-lg text-gray-600 text-justify">
        FalconAI works on large screens only. Do not worry, we are working on
        giving it the power to miniaturize itself and join you on the go!
      </p>
      <Link
        href="https://www.linkedin.com/company/falconassistant/"
        className="btn btn-primary"
      >
        Follow on LinkedIn
      </Link>
      <Link href="https://falconai.in" className="btn btn-primary">
        View Website
      </Link>
      <SignOutButton className="btn btn-primary" />
    </div>
  );
}
