import Paper from "./components/Paper";
import Sidebar from "./components/Sidebar";
import SidebarSection from "./components/SidebarSection";
export default function Raptor() {
  const questionTypes = [
    { value: "fillInTheBlanks", label: "Fill in the Blanks" },
    { value: "multipleChoice", label: "Multiple Choice" },
    { value: "trueFalse", label: "True/False" },
    { value: "shortAnswer", label: "Short Answer" },
    { value: "essay", label: "Essay" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 w-full select-none">
      <Sidebar className="col-start-1 col-span-3 row-start-1">
        <SidebarSection title={"Topics"}>Topic 1</SidebarSection>
      </Sidebar>
      <Paper className="col-start-4 col-span-7 min-h-screen">
        hello I am Raptor
      </Paper>
      <Sidebar className="col-start-11 col-span-2">
        <SidebarSection title={"Types"}>
          {questionTypes.map((questionType) => (
            <label key={questionType.value}>
              <input
                type="checkbox"
                name="questionType"
                value={questionType.value}
              />{" "}
              {questionType.label}
            </label>
          ))}
        </SidebarSection>
      </Sidebar>
    </div>
  );
}
