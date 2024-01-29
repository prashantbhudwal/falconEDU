import React, { ComponentType, ExoticComponent } from "react";
import {
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  FaceSmileIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

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
