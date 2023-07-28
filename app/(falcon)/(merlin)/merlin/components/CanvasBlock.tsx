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
      } bg-slate-800 text-neutral-300 px-5 py-3 rounded-lg ${
        isSelected ? "shadow-accent" : getBlockShadow(blockType)
      } ${isSelected ? "bg-slate-700" : ""}
      max-w-4xl w-full relative select-text`}
    >
      <div className="flex justify-between items-center pb-1 text-slate-500">
        <header className="text-base text-slate-500 gap-2 text-right flex items-end justify-end">
          {/* <p className="">{blockEmoji}</p> */}
          <p className="capitalize">{blockType}</p>
        </header>
        <div className="flex gap-2 items-center">
          <button
            className="btn btn-ghost btn-square btn-sm"
            onClick={() => onRemove(id)}
          >
            <FiTrash className="font-medium text-base" />
          </button>
          <button
            className="btn btn-ghost btn-square btn-sm"
            onClick={() => onDownload()}
          >
            <FiDownload className="font-medium text-base" />
          </button>

          <input
            className="radio radio-accent radio-sm font-semibold"
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
