import Report from "./report";

type ReportProps = {
  params: {
    classId: string;
    testBotId: string;
    studentBotId: string;
  };
};

export default async function ReportPage({ params }: ReportProps) {
  return (
    <div className="w-full h-full overflow-y-scroll custom-scrollbar pt-10">
      <Report params={params} />
    </div>
  );
}
