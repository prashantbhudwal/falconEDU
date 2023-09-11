import Link from "next/link";
import { BotTestData } from "../../../test-data";
import Avvvatars from "avvvatars-react";
import { getBotLink } from "../@bots/config";
import { PreviewCard } from "./ui/preview-card";
type BotPreviewProps = {
  data: BotTestData;
};
import { nanoid } from "nanoid";

export default function BotPreview({ data }: BotPreviewProps) {
  const botLink = getBotLink(data.id);
  return (
    <Link href={botLink}>
      <PreviewCard>
        <figure className="py-6">
          <Avvvatars value={nanoid()} style="shape" size={100} />
        </figure>
        <div className="card-body">
          <h2 className="card-title justify-center">{data.name}</h2>
          <div className="card-actions justify-center">
            <div className="badge badge-accent">{data.curriculum}</div>
            {data.subjects.map((subject) => (
              <div className="badge badge-info" key={subject}>
                {subject}
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>
    </Link>
  );
}
