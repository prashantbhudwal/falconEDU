import Link from "next/link";
export default function Footer() {
  return (
    <footer className="flex justify-evenly items-center py-4 text-slate-700">
      <Link
        href="https://notionforms.io/forms/work-with-us-5"
        className="hover:text-slate-500 underline underline-offset-4"
      >
        Work with us
      </Link>
      <div className="flex-none mx-2">
        <p>© 2023 FalconAI</p>
      </div>
      <Link
        href="https://notionforms.io/forms/invest-in-us"
        className="hover:text-slate-500 underline underline-offset-4"
      >
        Invest in us
      </Link>
    </footer>
  );
}
