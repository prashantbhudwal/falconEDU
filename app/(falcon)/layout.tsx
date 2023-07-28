import Navbar from "./(merlin)/components/Navbar";

export default function MerlinLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen min-w-full">
      <Navbar />
      {children}
    </div>
  );
}
