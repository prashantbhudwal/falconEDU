import { getBlockShadow } from "../../../../../utils";
import { ideaType } from "@/types";
import { Message } from "./Message";
import { FiTrash, FiDownload } from "react-icons/fi";
interface CanvasBlockProps {
  text: string;
  id: string;
  type: ideaType;
  emoji: string;
  onRemove: (id: string) => void;
  onDownload: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function CanvasBlock({
  text: displayText,
  id,
  emoji: blockEmoji,
  type: blockType,
  onRemove,
  onDownload,
  isSelected,
  onSelect,
}: CanvasBlockProps) {
  return (
    <div
      className={`${
        isSelected ? "shadow-lg" : "shadow-sm"
      } rounded-lg bg-slate-800 px-5 py-3 text-neutral-300 ${
        isSelected ? "shadow-accent" : getBlockShadow(blockType)
      } ${isSelected ? "bg-slate-700" : ""}
      relative w-full max-w-4xl select-text`}
    >
      <div className="flex items-center justify-between pb-1 text-slate-500">
        <header className="flex items-end justify-end gap-2 text-right text-base text-slate-500">
          {/* <p className="">{blockEmoji}</p> */}
          <p className="capitalize">{blockType}</p>
        </header>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-square btn-ghost btn-sm"
            onClick={() => onRemove(id)}
          >
            <FiTrash className="text-base font-medium" />
          </button>
          <button
            className="btn btn-square btn-ghost btn-sm"
            onClick={() => onDownload()}
          >
            <FiDownload className="text-base font-medium" />
          </button>

          <input
            className="radio-accent radio radio-sm font-semibold"
            type="radio"
            checked={isSelected}
            onChange={() => onSelect(id)}
          />
        </div>
      </div>
      <Message message={displayText} />
    </div>
  );
}
