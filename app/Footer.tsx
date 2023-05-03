import Link from "next/link";
export default function Footer() {
  return (
    <footer className="flex flex-col text-slate-700 items-center gap-4 py-6 border-t border-slate-700">
      <Link
        href="https://falconai.in"
        className="hover:text-slate-500 underline underline-offset-4 block"
      >
        FalconAI.in
      </Link>
      <Link
        href="https://www.youtube.com/watch?v=Rh9pBJRJ0zI"
        className="hover:text-slate-500 underline underline-offset-4 block"
      >
        Watch the demo
      </Link>
    </footer>
  );
}
