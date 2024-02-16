import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddIcon } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function UploadWidget({ classId }: { classId: string }) {
  return (
    <Card className="custom-scrollbar h-[400px] overflow-y-clip hover:overflow-y-auto">
      <CardHeader className="sticky top-0 bg-base-200">
        <div className="flex items-center justify-between">
          <CardTitle>Resources</CardTitle>
          <Link href={""}>
            <Button size={"icon"} variant={"ghost"}>
              <AddIcon size="sm" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
