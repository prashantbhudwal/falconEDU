import { Card, CardContent } from "@/components/ui/card";
export default function ShadThemePreview() {
  const themeColors = [
    { css: "bg-background", text: "text-foreground" },
    { css: "bg-card", text: "text-card-foreground" },
    { css: "bg-popover", text: "text-popover-foreground" },
    { css: "bg-primary", text: "text-primary-foreground" },
    { css: "bg-secondary", text: "text-secondary-foreground" },
    { css: "bg-muted", text: "text-muted-foreground" },
    { css: "bg-accent", text: "text-accent-foreground" },
    { css: "bg-destructive", text: "text-destructive-foreground" },
    { css: "bg-border", text: "text-base-200" },
    { css: "bg-input", text: "text-base-200t" },
    { css: "bg-ring", text: "text-base-200" },
    { css: "bg-base", text: "text-base-200" },
    { css: "bg-base-100", text: "text-base-200" },
    { css: "bg-base-200", text: "text-base-300" },
    { css: "bg-base-300", text: "text-base-100" },
  ];

  return (
    <Card className="flex w-full flex-col gap-3  p-4">
      <h1 className="text-3xl">Theme</h1>
      {themeColors.map((color, index) => (
        <Card key={index}>
          <CardContent className={color.css}>
            <p className={`${color.text} text-lg`}>
              {color.css}, {color.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
}
