import Report from "../../../report/[studentBotId]/report";
import Modal from "./modal";

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
      <div className="w-full overflow-y-scroll custom-scrollbar pt-10 bg-base-300 py-20 h-full">
        <Report params={params} />
      </div>
    </Modal>
  );
}
