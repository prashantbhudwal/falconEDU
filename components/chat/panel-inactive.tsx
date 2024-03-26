export const PanelInactive = ({ message }: { message: string }) => (
  <div className="fixed inset-x-0 bottom-0 rounded-t-lg bg-gray-900 p-4 text-white shadow-lg">
    <h1 className="text-center text-lg font-semibold">{message}</h1>
  </div>
);
