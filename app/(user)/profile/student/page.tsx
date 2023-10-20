import Navbar from "@/components/navbar/navbar";
import BasicInfo from "./basic-info";
import PaymentsTable from "./payments-table";
import { StudentHomeNavbar } from "@/app/dragon/student/components/student-navbar";

export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col items-center">
      <StudentHomeNavbar />
      <div className="flex flex-col items-center gap-3 max-w-5xl w-5/6 shadow-md rounded-sm shadow-base-300 my-4 p-4">
        <BasicInfo />
        <PaymentsTable />
      </div>
    </div>
  );
}
