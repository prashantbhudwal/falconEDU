export const InDev = ({ component }: { component: React.ReactNode }) => {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return (
    <div className="fixed bottom-1/2 right-2 z-20 min-h-36 w-fit border border-dotted border-accent/60 p-2">
      {component}
    </div>
  );
};
