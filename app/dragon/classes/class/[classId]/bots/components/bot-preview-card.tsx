import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Avvvatars from "avvvatars-react";
type ClassCardProps = {
  name?: string;
  children?: React.ReactNode;
  className?: string;
};
export default function BotCard({
  name,
  children,
  className,
  ...props
}: ClassCardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className={className}>{children}</CardTitle>
      </CardHeader>
    </Card>
  );
}
