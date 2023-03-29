export default function CanvasBlock({ generatedData }: { generatedData: any }) {
  return (
    <div className="bg-slate-800 text-slate-300 px-5 py-3 rounded-lg  shadow-sm shadow-emerald-600 max-w-4xl">
      <p className="leading-7 text-xl pt-2">{generatedData.text}</p>
    </div>
  );
}
