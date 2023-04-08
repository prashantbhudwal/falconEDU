export default function Issue() {
  return (
    <div className="absolute top-5 left-0 z-10 w-3/5 px-4 py-4 bg-slate-900 ring-emerald-500 rounded ring-1 shadow-md shadow-emerald-400">
      <ul className="text-base text-slate-300 flex flex-col gap-2">
        <li>
          <span className="font-semibold text-emerald-600 block pb-1">
            Incomplete lesson:
          </span>{" "}
          Due to limits of our free hosting plan, the lessons stop generating
          after 10 seconds. We are working on an alternative.
        </li>
        <li>
          <span className="font-semibold text-emerald-600 block pb-1">
            Very short lesson:
          </span>{" "}
          We are aware of this problem and are working actively on increasing
          the capacity of our app.
        </li>
      </ul>
    </div>
  );
}
