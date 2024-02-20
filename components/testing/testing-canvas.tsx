export const TestingCanvas = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-base-300">
      <div className="flex h-3/4 w-3/4 flex-col items-center justify-center overflow-y-auto rounded bg-base-200 shadow shadow-fuchsia-900">
        {children}
      </div>
    </div>
  );
};
