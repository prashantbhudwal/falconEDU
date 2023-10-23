import Navbar from "@/components/navbar/navbar";
import BasicInfo from "./basic-info";
import PaymentsTable from "./payments-table";
import { StudentHomeNavbar } from "@/app/dragon/student/components/student-navbar";

export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col items-center">
      <StudentHomeNavbar />
      <div className="flex flex-col items-center gap-3  h-screen w-full custom-scrollbar overflow-y-auto ">
        <BasicInfo />
        <PaymentsTable />
      </div>
    </div>
  );
}
