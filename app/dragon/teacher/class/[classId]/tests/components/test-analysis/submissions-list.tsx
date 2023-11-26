import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import Link from "next/link";
import { StudentsByBotConfigId } from "../../queries";

export const SubmissionsList = function ({
  students,
  classId,
  testBotId,
}: {
  students: StudentsByBotConfigId["students"];
  classId: string;
  testBotId: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {students.map((student) => (
        <Link
          href={`/dragon/teacher/class/${classId}/tests/edit-test/${testBotId}/report/${student.studentBotId}`}
          key={student.email}
          className="w-full"
        >
          <ItemCard
            title={student.name!}
            avatarUrl={student.image!}
            className="w-[600px]"
            description={student.email!}
          >
            <div className="flex gap-2">
              <ItemCardChip
                label="Status"
                value={student.isSubmitted ? "Attempted" : "Pending"}
                valueColor={
                  student.isSubmitted ? "text-primary" : "text-accent"
                }
              />
            </div>
          </ItemCard>
        </Link>
      ))}
    </div>
  );
};
