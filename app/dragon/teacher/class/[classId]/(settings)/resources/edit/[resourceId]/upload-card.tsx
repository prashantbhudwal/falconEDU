import {
  DocumentFileIcon,
  PdfFileIcon,
  ImageFileIcon,
  TextFileIcon,
  AttachmentIcon,
} from "@/components/icons";

export const UploadCard = () => {
  const iconWithTextConfig = [
    {
      icon: <PdfFileIcon color="info" size="sm" />,
      text: "PDF",
    },
    {
      icon: <DocumentFileIcon color="secondary" size="sm" />,
      text: "DOC",
    },
    {
      icon: <TextFileIcon color="primary" size="sm" />,
      text: "TXT",
    },
    {
      icon: <ImageFileIcon color="warning" size="sm" />,
      text: "PHOTO",
    },
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="-rotate-45 pl-2">
        <AttachmentIcon color="white" size="sm" />
      </div>
      {iconWithTextConfig.map((item) => (
        <IconWithText key={item.text} Icon={item.icon} text={item.text} />
      ))}
    </div>
  );
};

const IconWithText = ({
  Icon,
  text,
}: {
  Icon: React.ReactNode;
  text: string;
}) => (
  <div className="flex h-16 w-16 flex-col items-center justify-center space-y-2">
    {Icon}
    <span className="text-xs">{text}</span>
  </div>
);
