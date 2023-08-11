import { TooltipProvider } from "./components/ui/tooltip";
export default function ChubbiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
