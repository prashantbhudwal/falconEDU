import { Card, CardContent } from "@/components/ui/card";
import { default as NextImage } from "next/image";

export function Image() {
  return (
    <Card>
      <CardContent className="rounded-lg bg-purple-700 p-4">
        <NextImage
          src="/chubbi.png"
          alt="Picture of the author"
          width={500}
          height={500}
        />
      </CardContent>
    </Card>
  );
}
