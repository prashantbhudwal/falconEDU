export default function Loading() {
  return (
    <div className="bg-slate-900 text-slate-900 px-5 py-3 rounded-lg w-screen h-screen">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-full h-6 bg-slate-900 rounded-full animate-pulse"></div>
        <div className="w-full h-48 bg-slate-900 rounded-lg animate-pulse">
          <div className="w-1/3 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/2 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/4 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
        </div>
        <div className="w-full h-48 bg-slate-900 rounded-lg animate-pulse">
          <div className="w-1/2 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/4 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/3 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
        </div>
        <div className="w-full h-48 bg-slate-900 rounded-lg animate-pulse">
          <div className="w-1/4 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/3 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
          <div className="w-1/2 h-4 my-2 mx-2 bg-slate-800 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
