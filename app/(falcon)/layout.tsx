import Navbar from "@/components/navbar/navbar";
import Expired from "../../components/auth/expired";

export default function MerlinLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <Expired>
      <div className="flex h-screen min-w-full flex-col">
        <Navbar />
        {children}
      </div>
    </Expired>
  );
}
