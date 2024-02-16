import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function UploadWidget({ classId }: { classId: string }) {
  return (
    <Card className="custom-scrollbar h-[400px] overflow-y-clip hover:overflow-y-auto">
      <CardHeader className="sticky top-0 bg-base-200">
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent>
     
      </CardContent>
    </Card>
  );
}
