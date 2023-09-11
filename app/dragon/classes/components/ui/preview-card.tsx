type PreviewCardProps = {
  children: React.ReactNode;
};

export const PreviewCard: React.FC<PreviewCardProps> = ({ children }) => {
  return (
    <div className="card card-compact w-64 bg-base-100 shadow-xl hover:bg-base-200 hover:shadow-2xl hover:scale-105 cursor-pointer">
      {children}
    </div>
  );
};
