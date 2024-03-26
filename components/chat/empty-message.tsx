export const EmptyMessage = ({ message }: { message: string }) => {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <div className="flex place-content-center rounded-md bg-slate-900 py-4">
        <h1 className="text-xl font-medium text-slate-500">{message}</h1>
      </div>
    </div>
  );
};
