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
import { type Student } from "./edit/[teacherId]/page";
import { FiTrash2 } from "react-icons/fi";

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

export function StudentTable({ students }: { students: Student[] }) {
  const studentList = defaultValues;

  return (
    <div className="w-4/6">
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
          {studentList.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
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
    </div>
  );
}
