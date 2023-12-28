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
    { css: "bg-border", text: "text-text-900" },
    { css: "bg-input", text: "text-text-900t" },
    { css: "bg-ring", text: "text-text-900" },
    { css: "bg-base", text: "text-text-900" },
    { css: "bg-base-100", text: "text-text-900" },
    { css: "bg-base-200", text: "text-text-950" },
    { css: "bg-base-300", text: "text-text-800" },
  ];

  return (
    <Card className="w-full p-4 flex flex-col  gap-3">
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
