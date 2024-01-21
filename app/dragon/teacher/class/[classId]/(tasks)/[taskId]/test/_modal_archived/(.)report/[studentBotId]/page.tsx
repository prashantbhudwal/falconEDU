import { ReportModal as Modal } from "../../../../../_components/report-modal";
import { _TestOverflow } from "@/components/_test-overflow";

type ReportProps = {
  params: {
    classId: string;
    taskId: string;
    studentBotId: string;
  };
};
export default async function ReportModal({ params }: ReportProps) {
  return (
    <Modal>
      <div className="custom-scrollbar h-screen w-full overflow-y-scroll rounded-xl bg-base-300 py-5 ring-1 ring-slate-700 ">
        {/* <Report params={params} /> */}
      </div>
    </Modal>
  );
}
