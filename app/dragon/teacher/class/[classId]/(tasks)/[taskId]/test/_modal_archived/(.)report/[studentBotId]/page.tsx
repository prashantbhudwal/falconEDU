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
      <div className="w-full py-5 overflow-y-scroll custom-scrollbar h-screen bg-base-300 rounded-xl ring-1 ring-slate-700 ">
        {/* <Report params={params} /> */}
      </div>
    </Modal>
  );
}
