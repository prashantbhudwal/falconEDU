import React, { ComponentType, ExoticComponent } from "react";
import {
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  FaceSmileIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon as MinusIconSolid,
  XMarkIcon,
  PhotoIcon,
  PlayIcon as PlayIconSolid,
} from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";

// Tailwind Size Mapping
const sizeMapping = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
  "2xl": "h-14 w-14",
};

// Color Mapping
const colorMapping = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  white: "text-white",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  purple: "text-purple-200",
};

type BaseIconProps = {
  Icon: ComponentType<React.SVGProps<SVGSVGElement>> | ExoticComponent<any>;
  size?: keyof typeof sizeMapping;
  color?: keyof typeof colorMapping;
  className?: string;
};

const BaseIcon: React.FC<BaseIconProps> = ({
  Icon,
  size = "md",
  color = "currentColor",
  className,
  ...props
}) => {
  const sizeClass = sizeMapping[size] || sizeMapping.md;
  const colorClass =
    color === "currentColor"
      ? ""
      : colorMapping[color as keyof typeof colorMapping] || "";
  const combinedClassNames =
    `${sizeClass} ${colorClass} ${className || ""}`.trim();

  return <Icon className={combinedClassNames} {...props} />;
};

export default BaseIcon;

export type IconProps = Omit<BaseIconProps, "Icon">;

export const Settings: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={WrenchScrewdriverIcon} />
);

export const StudentIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={FaceSmileIcon} />
);

export const TeacherIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={AcademicCapIcon} />
);

export const SchoolIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={BuildingLibraryIcon} />
);

export const AdminIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={UserCircleIcon} />
);

export const DeleteIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={TrashIcon} />
);

export const AddIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={PlusIcon} />
);

export const MinusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={MinusIconSolid} />
);

export const CrossCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={XCircleIcon} />
);

export const CrossIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={XMarkIcon} />
);

export const MediaIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={PhotoIcon} />
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} Icon={PlayIconSolid} />
);
