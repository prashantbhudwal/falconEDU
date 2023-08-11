import { TooltipProvider } from "./components/ui/tooltip";
import { Header } from "./components/header";
export default function ChubbiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Header />
      {children}
    </TooltipProvider>
  );
}
