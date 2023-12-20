"use client";
import { useSearchParams } from "next/navigation";
import SignIn from "../sign-in";
const StudentAuth = () => {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("inviteId");
  return (
    <div>
      <SignIn type="student" inviteId={inviteId} />
    </div>
  );
};

export default StudentAuth;
