export default function Issue() {
  return (
    <div className="absolute bottom-10 right-0 z-10 w-3/5 px-4 py-4 bg-slate-900 ring-emerald-500 rounded ring-1 shadow-md shadow-emerald-400">
      {/* <h1 className="font-semibold text-emerald-600 block pb-1 text-xl">
        Common Issues
      </h1> */}
      <ul className="text-base text-slate-300 flex flex-col gap-2">
        {/* <li>
          <span className="font-semibold text-emerald-600 block pb-1">
            Incomplete lesson:
          </span>{" "}
          Due to limits of our free hosting plan, the lessons stop generating
          after 60 seconds. We are working on an alternative.
        </li> */}
        <li>
          <span className="font-semibold text-emerald-600 block pb-1">
            Very short lesson
          </span>{" "}
          We are aware of this problem and are working actively on increasing
          the capacity of our AI models and app.
        </li>
        <li>
          <span className="font-semibold text-emerald-600 block pb-1">
            Other issues?
          </span>{" "}
          Call us at +91 8879881971.
        </li>
      </ul>
    </div>
  );
}
