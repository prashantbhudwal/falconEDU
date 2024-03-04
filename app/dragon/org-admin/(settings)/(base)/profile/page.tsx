import { BasicInfo } from "@/app/dragon/teacher/(home)/(settings)/profile/basic-info";
import { DeleteAccountSection } from "@/components/delete-account-section";
export default function ProfilePage() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-4 flex  w-5/6 max-w-5xl flex-col gap-3 rounded-sm bg-base-200 p-4 shadow-md shadow-base-300">
        <BasicInfo />
        <DeleteAccountSection />
      </div>
    </div>
  );
}
