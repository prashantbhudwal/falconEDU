import { db } from "@/app/dragon/teacher/routers";
import { formatName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { VerifyInviteButton } from "./components/verifyInviteButton";
import { CancelInviteButton } from "./components/cancelInviteButton";

export default async function InvitePage({
  params,
}: {
  params: { inviteId: string };
}) {
  const { inviteId } = params;
  const modelInfo = {
    teacherName: "",
    teacherImage: "",
    className: "",
    teacherEmail: "",
    classId: "",
    studentEmail: "",
  };
  const { invitedStudent } =
    await db.inviteStudentsRouter.getInviteDetailsByInviteId({
      inviteId: inviteId || "",
    });

  if (invitedStudent) {
    modelInfo.teacherName = formatName({
      name: invitedStudent.Class?.Teacher.User.name || "",
    });
    modelInfo.teacherImage = invitedStudent.Class?.Teacher.User.image || "";
    modelInfo.className = invitedStudent.Class?.name || "";
    modelInfo.teacherEmail = invitedStudent.Class?.Teacher.User.email || "";
    modelInfo.classId = invitedStudent.classId || "";
    modelInfo.studentEmail = invitedStudent.studentEmail || "";
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {invitedStudent && (
        <div className="flex flex-col items-center gap-5 rounded-xl bg-base-200 p-10">
          <h3 className="flex items-center text-2xl">
            Welcome to{" "}
            <span className="flex items-center gap-2 px-2 font-bold text-slate-300">
              FalconAi
              <Image src={"/chubbi.png"} alt="logo" width={40} height={40} />
            </span>
          </h3>
          <div className="flex items-center gap-4">
            <Image
              className="rounded-full"
              src={modelInfo.teacherImage}
              alt="logo"
              width={55}
              height={55}
            />
            <div>
              <h3 className="text-lg font-semibold">{modelInfo.teacherName}</h3>
              <Link
                href={`mailto:${modelInfo.teacherEmail}`}
                target="_blank"
                className="text-xs text-blue-400 hover:underline"
              >
                {modelInfo.teacherEmail}
              </Link>
            </div>
          </div>
          <div className="text-lg">
            Invited you to join{" "}
            <span className="font-bold text-slate-300">
              &quot;{modelInfo.className}&quot;
            </span>{" "}
            class
          </div>
          <div className="flex gap-3">
            <CancelInviteButton inviteId={inviteId} />
            <VerifyInviteButton
              studentEmail={modelInfo.studentEmail}
              classId={modelInfo.classId}
              inviteId={inviteId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
