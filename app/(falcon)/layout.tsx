import Navbar from "@/components/Navbar";

export default function MerlinLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-w-full flex-col">
      {/* <Navbar /> */}
      <div className="bg-base-100 h-12"></div>
      {children}
    </div>
  );
}
