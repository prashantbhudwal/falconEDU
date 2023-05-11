import Box from "./Box";
import Header, { HeaderProps, ColorOption } from "./Header";

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
      className={`${className} flex flex-col gap-6 text-slate-300`}
      color={color}
    >
      <Header color={color} {...headerProps} />
      {children}
    </Box>
  );
}
