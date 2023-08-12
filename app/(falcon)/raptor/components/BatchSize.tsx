"use client";
import { useAtom } from "jotai";
import { batchSizeAtom } from "@/atoms/worksheet";
export const BatchSize: React.FC = () => {
  const [batchSize, setBatchSize] = useAtom(batchSizeAtom);

  const incrementBatchSize = () => {
    if (batchSize < 5) {
      setBatchSize(batchSize + 1);
    }
  };

  const decrementBatchSize = () => {
    if (batchSize > 1) {
      setBatchSize(batchSize - 1);
    }
  };

  const isButtonDisabled = batchSize > 4;

  return (
    <div className="flex gap-1 rounded-xl p-1 text-sm ring ring-slate-800">
      <button onClick={decrementBatchSize}>
        <div
          className={
            "flex items-center gap-1 rounded-lg border px-3 py-2 " +
            "border-black/10 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] bg-slate-800"
          }
        >
          <span className="truncate text-sm">-</span>
        </div>
      </button>
      <div className="flex items-center gap-1">
        <div className="px-2 text-gray-500">{batchSize}</div>
      </div>
      <button onClick={incrementBatchSize} disabled={isButtonDisabled}>
        <div
          className={
            "flex items-center gap-1 rounded-lg border px-3 py-2 " +
            "border-black/10 shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] " +
            (isButtonDisabled ? "opacity-20" : "") + // Decrease opacity when disabled
            " bg-slate-800"
          }
        >
          <span className="truncate text-sm">+</span>
        </div>
      </button>
    </div>
  );
};
