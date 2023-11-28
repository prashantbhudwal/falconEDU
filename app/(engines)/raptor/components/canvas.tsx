import Box from "@/components/box";
import Header, { HeaderProps } from "@/components/canvas-header";
import { ColorOption } from "@/types";

export default function Canvas({
  children,
  className,
  color = "primary",
  ...headerProps
}: React.PropsWithChildren<
  {
    className?: string;
    color?: ColorOption;
  } & HeaderProps
>) {
  return (
    <Box
      className={`${className} mt-2 flex flex-col text-slate-300`}
      color={color}
    >
      <Header color={color} {...headerProps} />
      {children}
    </Box>
  );
}
