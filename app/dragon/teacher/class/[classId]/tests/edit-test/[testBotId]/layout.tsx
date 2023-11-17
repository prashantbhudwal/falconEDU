export default function Layout(props: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {props.children}
      {props.modal}
    </div>
  );
}
