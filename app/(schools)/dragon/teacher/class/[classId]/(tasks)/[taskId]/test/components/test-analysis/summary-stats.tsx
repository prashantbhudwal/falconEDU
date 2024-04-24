import { FaChartLine, FaThumbsDown, FaTrophy, FaUsers } from "react-icons/fa6";

export const SummaryStats = async function ({
  averageScore,
  highestScore,
  leastScore,
  totalPendingTest,
  totalSubmittedTest,
}: {
  averageScore: number;
  highestScore: number;
  leastScore: number;
  totalPendingTest: number;
  totalSubmittedTest: number;
}) {
  return (
    <div className="bg-dark-500 rounded-lg px-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {/* <StatCard
          title="Submissions"
          value={`${totalSubmittedTest}/${
            totalSubmittedTest + totalPendingTest
          }`}
          icon=<FaUsers />
          color="text-accent"
        /> */}
        <StatCard
          title="Average Score"
          value={averageScore}
          icon=<FaChartLine />
          color="text-info"
        />
        <StatCard
          title="Highest Score"
          value={highestScore}
          icon=<FaTrophy />
          color="text-primary"
        />
        <StatCard
          title="Lowest Score"
          value={leastScore}
          icon=<FaThumbsDown />
          color="text-destructive"
        />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`card rounded-lg bg-base-200 p-4 shadow-lg`}>
    <div className="flex items-center space-x-4">
      <div className={`rounded-full bg-base-300 p-4 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-200">{value}</p>
        <p className={`text-sm capitalize `}>{title}</p>
      </div>
    </div>
  </div>
);
