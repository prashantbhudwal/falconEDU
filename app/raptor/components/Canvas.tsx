import Box from "@/app/components/Box";
import Header, { HeaderProps } from "@/app/components/Header";
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
      className={`${className} flex flex-col text-slate-300 pt-0`}
      color={color}
    >
      <Header color={color} {...headerProps} />
      {children}
    </Box>
  );
}
