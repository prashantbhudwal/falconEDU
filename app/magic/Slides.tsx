type SlideCanvasProps = {
  className?: string;
};

export default function SlideCanvas({ className }: SlideCanvasProps) {
  return <div className={`${className} bg-slate-900`}></div>;
}
