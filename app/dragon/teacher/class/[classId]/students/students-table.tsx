"use client";
import { removeStudentFromClass } from "../../../mutations";
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

export function StudentTable({ students }: { students: StudentsByClassId }) {
  const deleteStudent = async function (studentId: string, classId: string) {
    const result = await removeStudentFromClass(studentId, classId);
    if (result.success) {
    }
    if (result.error) {
    }
  };

  if (students?.length === 0 || !students) {
    return <p className="mx-auto text-xl">No students in the class, yet. ☹️</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Remove</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell className="font-medium">{student.User.name}</TableCell>
            <TableCell>{student.User.email}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                onClick={() => deleteStudent(student.id, student.classId!)}
              >
                <FiTrash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
