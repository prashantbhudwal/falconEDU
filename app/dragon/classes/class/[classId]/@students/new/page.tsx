import ClassForm from "../add-students-form";
import { Paper } from "@/components/ui/Paper";
export default function NewClass() {
  return (
    <Paper className="w-5/6 mx-auto flex flex-col items-center h-screen">
      <ClassForm />
    </Paper>
  );
}
