import Link from "next/link";
export default function Footer() {
  return (
    <footer className="flex flex-col text-slate-700 items-center gap-4 py-6 border-t border-slate-700">
      <Link
        href="https://notionforms.io/forms/work-with-us-5"
        className="hover:text-slate-500 underline underline-offset-4 block"
      >
        Work with us
      </Link>
      <Link
        href="https://notionforms.io/forms/invest-in-us"
        className="hover:text-slate-500 underline underline-offset-4 block"
      >
        Invest in us
      </Link>
    </footer>
  );
}
