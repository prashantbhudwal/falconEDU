export default function Beta({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-start">
      <div className="">{children}</div>
      <span className="-mt-1 ml-2 rounded bg-yellow-300 px-2 py-1 text-sm font-semibold text-yellow-800">
        beta
      </span>
    </div>
  );
}
