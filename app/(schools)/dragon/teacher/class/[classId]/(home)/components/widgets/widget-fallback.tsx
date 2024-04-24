import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WidgetFallback = () => {
  return (
    <Card className="h-[250px]">
      <CardHeader>
        <CardTitle className="h-7 animate-pulse rounded-xl bg-base-100"></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
        <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
        <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
        <div className="mt-3 h-4 animate-pulse rounded-xl bg-base-100"></div>
      </CardContent>
    </Card>
  );
};
