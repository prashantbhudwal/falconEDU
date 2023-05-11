type SidebarSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className="pt-3">
      <header className="text-left font-medium text-slate-500 border-b border-solid border-slate-700 pb-2 mb-4">
        <p className="capitalize">{title}</p>
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export default SidebarSection;
