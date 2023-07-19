"use client";
import { motion, MotionProps } from "framer-motion";

type CombinedProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps;

interface ButtonProps extends CombinedProps {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  outlined?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  primary,
  secondary,
  outlined,
  ...props
}) => {
  let buttonStyle = "bg-emerald-500 text-slate-700";

  if (secondary) {
    buttonStyle = "bg-fuchsia-700 text-slate-100";
  } else if (outlined) {
    buttonStyle = "border-2 border-slate-700 bg-transparent text-slate-700";
  } else if (
    typeof primary === "undefined" &&
    typeof secondary === "undefined" &&
    typeof outlined === "undefined"
  ) {
    primary = true;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      {...props}
      className={`${buttonStyle} ring-1 ring-slate-700 rounded-md font-medium capitalize disabled:opacity-50 px-8 py-2 ${
        props.className ? props.className : ""
      }`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
