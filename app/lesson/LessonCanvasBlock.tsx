export default function LessonCanvasBlock({
  text: displayText,
}: {
  text: string | string[];
}) {
  return (
    <div
      className={`bg-slate-100 text-slate-900 px-5 py-5 rounded-lg shadow-sm shadow-slate-200 max-w-4xl w-full`}
    >
      <p className="leading-7 text-lg pt-8 py-5 whitespace-pre-wrap">
        {displayText}
      </p>
    </div>
  );
}
