import { ChatList } from "@/components/chat/chat-list";
import {
  getDefaultChatMessagesByStudentBotId,
  getSingleStudentByStudentBotId,
  getUserImageByStudentBotId,
} from "../../../../queries";
import { Paper } from "@/components/ui/paper";
import PieChartComponent from "./pieChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/progress";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTestResultsByBotId } from "@/app/dragon/teacher/queries";
import { type TestResultsByBotId } from "@/app/dragon/teacher/queries";
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
    <div className="w-full overflow-y-scroll custom-scrollbar pt-10">
      <Report params={params} />
    </div>
  );
}
