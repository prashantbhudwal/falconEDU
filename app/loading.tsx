export default function Loading() {
  return (
    <div className="h-screen w-screen rounded-lg bg-slate-900 px-5 py-3 text-text-900">
      <div className="flex animate-pulse flex-col items-center gap-4">
        <div className="h-6 w-full animate-pulse rounded-full bg-slate-900"></div>
        <div className="h-48 w-full animate-pulse rounded-lg bg-slate-900">
          <div className="m-2 h-4 w-1/3 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/2 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/4 rounded-full bg-slate-800"></div>
        </div>
        <div className="h-48 w-full animate-pulse rounded-lg bg-slate-900">
          <div className="m-2 h-4 w-1/2 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/4 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/3 rounded-full bg-slate-800"></div>
        </div>
        <div className="h-48 w-full animate-pulse rounded-lg bg-slate-900">
          <div className="m-2 h-4 w-1/4 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/3 rounded-full bg-slate-800"></div>
          <div className="m-2 h-4 w-1/2 rounded-full bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
}
