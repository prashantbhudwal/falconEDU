import { useDrop, DropTargetMonitor } from "react-dnd";

export default function BoxDrop({
  children,
  className,
  questionType,
  bloomLevel,
}: React.PropsWithChildren<{
  className?: string;
  questionType: string;
  bloomLevel: string;
}>) {
  const specObject = {
    accept: "topic",
    drop: (item: any) => console.log(item, questionType, bloomLevel),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => specObject);

  return (
    <div
      className={`${className} text-center text-sm pb-2 ${
        isOver ? "bg-fuchsia-500 scale-150 rounded-md" : ""
      }`}
    >
      <div ref={drop}>{children}</div>
    </div>
  );
}
