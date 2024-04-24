import Navbar from "@/components/navbar/navbar";
import BasicInfo from "./basic-info";
import PaymentsTable from "./payments-table";
import { StudentHomeNavbar } from "@/app/(schools)/dragon/student/components/student-navbar";

export default function ProfilePage() {
  return (
    <div className="w-full">
      <StudentHomeNavbar />
      <div className="flex flex-col items-center">
        <div className="custom-scrollbar flex h-screen w-full  flex-col items-center gap-3 overflow-y-auto ">
          <BasicInfo />
          <PaymentsTable />
        </div>
      </div>
    </div>
  );
}
