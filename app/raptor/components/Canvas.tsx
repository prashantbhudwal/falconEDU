import Box from "./Box";

export default function Canvas({
  children,
  className,
  color = "primary",
}: React.PropsWithChildren<{
  className?: string;
  color?: "primary" | "secondary" | "gray";
}>) {
  return (
    <Box
      className={`${className} flex flex-col gap-6 text-slate-300`}
      color={color}
    >
      {children}
    </Box>
  );
}
