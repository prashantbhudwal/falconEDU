import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiTrash2 } from "react-icons/fi";
import { type StudentsByClassId } from "../../../queries";

const defaultValues = [
  {
    id: "1",
    name: "John Doe",
    email: "test@test.com",
    grade: "1",
  },
  {
    id: "2",
    name: "John Eoe",
    email: "test@test.com",
    grade: "1",
  },
  {
    id: "3",
    name: "John Foe",
    email: "test@test.com",
    grade: "1",
  },
];

export function StudentTable({ students }: { students: StudentsByClassId }) {
  console.log(students);
  if (students?.length === 0 || !students) {
    return <p className="mx-auto text-xl">No students in the class, yet. ☹️</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead className="text-right">Remove</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.User.name}</TableCell>
            <TableCell>{student.User.email}</TableCell>
            <TableCell>Grade {student.grade}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost">
                <FiTrash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
