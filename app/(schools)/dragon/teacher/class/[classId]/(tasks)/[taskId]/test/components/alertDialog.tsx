import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertDialogProps = React.HTMLProps<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  title: string;
  description: string;
};
export const AlertDialogComponent = ({
  title,
  description,
  children,
  className,
}: AlertDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-error">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
