interface ModeToggleProps {
  isAdvancedMode: boolean;
  setIsAdvancedMode: (mode: boolean) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  isAdvancedMode,
  setIsAdvancedMode,
}) => {
  return (
    <div className="flex rounded-xl bg-slate-800 p-1 w-fit gap-1 text-sm">
      <button onClick={() => setIsAdvancedMode(false)}>
        <div
          className={
            "flex items-center gap-1 rounded-lg border px-3 py-2 " +
            (!isAdvancedMode
              ? "border-black/10 bg-white shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] dark:border-gray-600/50 dark:bg-slate-700"
              : "border-transparent text-gray-500 dark:hover:bg-white/5")
          }
        >
          <span className="truncate text-sm">Fast</span>
        </div>
      </button>
      <button onClick={() => setIsAdvancedMode(true)}>
        <div
          className={
            "relative flex items-center gap-1 rounded-lg border px-3 py-2 " +
            (isAdvancedMode
              ? "border-black/10 bg-white shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] dark:border-gray-600/50 dark:bg-fuchsia-700"
              : "border-transparent text-gray-500 dark:hover:bg-white/5 opacity-80")
          }
        >
          <span className="truncate text-sm">✨Pro</span>
        </div>
      </button>
    </div>
  );
};
