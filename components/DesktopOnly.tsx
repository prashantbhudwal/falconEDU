import SignOutButton from "@/components/SignOutBtn";
import Link from "next/link";

export default function DesktopOnly() {
  return (
    <div className="my-12 flex flex-col gap-8 px-4 pt-20">
      <p className="text-6xl font-semibold text-fuchsia-700">🧑‍💻</p>
      <p className="text-xl font-semibold text-fuchsia-700">
        Laptops & larger screens only.
      </p>
      <p className="text-justify text-lg text-gray-600">
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
