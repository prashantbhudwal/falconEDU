import { BasicInfo } from "./basic-info";
import { DeleteAccountSection } from "@/components/delete-account-section";
export default function ProfilePage() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col  gap-3 max-w-5xl w-5/6 shadow-md rounded-sm shadow-base-300 my-4 p-4 bg-base-200">
        <BasicInfo />
        <DeleteAccountSection />
      </div>
    </div>
  );
}
