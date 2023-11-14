import Report from "../../../report/[studentBotId]/report";
import Modal from "./modal";
import { _TestOverflow } from "@/components/_test-overflow";

type ReportProps = {
  params: {
    classId: string;
    testBotId: string;
    studentBotId: string;
  };
};
export default async function ReportModal({ params }: ReportProps) {
  return (
    <Modal>
      <div className="w-full py-10 overflow-y-scroll custom-scrollbar h-screen bg-base-300 rounded-xl ring-1 ring ring-slate-700 ">
        <Report params={params} />
      </div>
    </Modal>
  );
}
