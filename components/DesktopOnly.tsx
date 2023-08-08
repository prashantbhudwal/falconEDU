import SignOutButton from "@/app/(falcon)/(merlin)/components/SignOutBtn";
import Link from "next/link";

export default function DesktopOnly() {
  return (
    <div className="pt-20 my-12 flex flex-col gap-8 px-2">
      <p className="text-6xl text-fuchsia-700 font-semibold">🧑‍💻</p>
      <p className="text-xl text-fuchsia-700 font-semibold">
        Laptops & larger screens only.
      </p>
      <p className="text-lg text-gray-600 text-justify">
        FalconAI works on large screens only. Do not worry, we are working on
        giving it the power to miniaturize itself and join you on the go!
      </p>
      <Link
        className="btn btn-primary"
        href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI"
      >
        Watch FalconAI Demo
      </Link>
      <SignOutButton className="btn btn-primary mt-4" />
    </div>
  );
}
