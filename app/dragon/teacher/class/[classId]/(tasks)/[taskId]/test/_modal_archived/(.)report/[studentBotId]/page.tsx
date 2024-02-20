import { ReportModal as Modal } from "../../../../../_components/report-modal";

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
      <div className=" h-screen w-full overflow-y-scroll rounded-xl bg-base-300 py-5 ring-1 ring-slate-700 ">
        {/* <Report params={params} /> */}
      </div>
    </Modal>
  );
}
