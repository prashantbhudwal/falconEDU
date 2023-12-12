import { Button } from "@/components/ui/button";
import { getStudentsURL } from "@/lib/urls";
import Link from "next/link";

export const NoStudents = function ({ classId }: { classId: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center font-semibold text-xl mt-10 ">
        You have no students in this class.
      </h1>
      <Link href={getStudentsURL(classId)}>
        <Button variant={"outline"}>Add Students</Button>
      </Link>
    </div>
  );
};
