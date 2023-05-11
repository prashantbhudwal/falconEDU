import Paper from "./components/Paper";
import Sidebar from "./components/Sidebar";
import SidebarSection from "./components/SidebarSection";
export default function Raptor() {
  return (
    <div className="grid grid-cols-12 gap-4 w-full select-none">
      <Sidebar className="col-start-1 col-span-2 row-start-1">
        <SidebarSection title={"Prompts"}>Prompts</SidebarSection>
        <SidebarSection title={"Prompts"}>Prompts</SidebarSection>
      </Sidebar>
      <Paper className="col-start-3 col-span-8 min-h-screen">
        hello I am Raptor
      </Paper>
      <Sidebar className="col-start-11 col-span-2">
        <SidebarSection title={"Outline"}>Outline</SidebarSection>
        <SidebarSection title={"Prompts"}>Prompts</SidebarSection>
      </Sidebar>
    </div>
  );
}
