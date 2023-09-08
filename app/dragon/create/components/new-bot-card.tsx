import Link from "next/link";
import { PreviewCard } from "./ui/preview-card";
export const NewBotCard: React.FC = () => {
  return (
    <Link href="/dragon/create/bot/new">
      <PreviewCard>
        <figure className="py-6">
          <div className="text-7xl font-bold text-center w-full">+</div>
        </figure>
        <div className="card-body">
          <h2 className="card-title justify-center">New Bot</h2>
        </div>
      </PreviewCard>
    </Link>
  );
};
