import Navbar from "@/components/Navbar";

export default function MerlinLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-w-full flex-col">
      <Navbar />
      {children}
    </div>
  );
}
