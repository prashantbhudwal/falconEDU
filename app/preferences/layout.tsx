export default function PreferencesLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
